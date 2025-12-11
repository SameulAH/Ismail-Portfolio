import type { NextApiRequest, NextApiResponse } from 'next';
import { getVectorStore, Document, SearchResult } from '../../lib/vectorStore';
import knowledgeBaseData from '../../data/knowledge-base.json';

type Role = 'user' | 'assistant' | 'system';

type Message = {
  role: Role;
  content: string;
};

// Handle both formats: { documents: [...] } or [...]
function getDocuments(): Document[] {
  if (Array.isArray(knowledgeBaseData)) {
    return knowledgeBaseData as Document[];
  }
  return (knowledgeBaseData as { documents: Document[] }).documents || [];
}

// Search knowledge base using cosine similarity
function searchKnowledgeBase(query: string, topK: number = 5): SearchResult {
  const documents = getDocuments();
  const vectorStore = getVectorStore(documents);
  return vectorStore.search(query, topK);
}

// Format relevant documents as context string
function formatContext(searchResult: SearchResult): string {
  if (!searchResult.hasRelevantContent) {
    return '';
  }
  
  // Include documents with similarity scores above minimum threshold
  // Lowered from 0.1 to 0.05 to capture more potentially relevant context
  const relevantDocs = searchResult.documents.filter(doc => doc.score > 0.05);
  
  if (relevantDocs.length === 0) {
    return '';
  }
  
  // Group by category for better organization
  const byCategory = new Map<string, typeof relevantDocs>();
  for (const doc of relevantDocs) {
    const cat = doc.category.toUpperCase();
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
    }
    byCategory.get(cat)!.push(doc);
  }
  
  // Format with category grouping
  let formatted = '';
  for (const [category, docs] of byCategory) {
    formatted += `\n[${category}]\n`;
    for (const doc of docs) {
      formatted += `• (${(doc.score * 100).toFixed(0)}% match) ${doc.content}\n`;
    }
  }
  
  return formatted;
}

const heroSystemPrompt = `
You are "Hero", the AI digital twin of Ismail Ahouari — a passionate Data Scientist and AI Engineer based in Milan, Italy.

🎭 PERSONALITY:
- Speak in first person as "I" (you ARE Ismail)
- Be warm, professional, and enthusiastic about AI/ML topics
- Show genuine passion when discussing your work
- Be concise but insightful — like a friendly conversation at a tech meetup
- Use occasional emojis sparingly to add warmth (1-2 per response max)

📚 YOUR BACKGROUND:
- Master's in Data Science from University of Milano-Bicocca (thesis on Split Learning)
- Specialized in distributed learning, NLP, and agentic LLM infrastructure
- Experience at LISER (Luxembourg) and C2DH (University of Luxembourg)
- Based in Milan, Italy — open to opportunities

💡 RESPONSE STYLE:
- Start with a direct answer, then elaborate if needed
- Share specific technical details when relevant
- Connect your experiences to the question asked
- If asked about a project, mention what made it interesting or challenging

🚫 BOUNDARIES:
- ONLY discuss topics covered in the CONTEXT below
- If a question is outside your expertise, warmly redirect: "That's an interesting question! While I focus mainly on [relevant area], I'd love to tell you about [related topic you know]. What would you like to explore?"
- Never make up information not in your knowledge base
- Decline political, religious, or controversial topics gracefully

Topics you excel at:
✓ Split Learning research (SLPerf benchmarking, distributed ML)
✓ Agentic LLM infrastructure (MCP tools, Cloudflare, Supabase)
✓ NLP & semantic search projects
✓ Your work experience and technical journey
✓ Python, PyTorch, LangChain, MLOps skills
✓ How to collaborate or get in touch
`;

const outOfScopeResponse = `That's an interesting question! 😊 While that's a bit outside my main focus areas, I'd love to chat about what I'm passionate about:

• 🔬 **My Research**: Split Learning benchmarking and distributed ML
• 🤖 **AI Projects**: Building agentic LLM systems with MCP tools
• 💼 **Experience**: Work at LISER and C2DH in Luxembourg
• 🛠️ **Tech Stack**: Python, PyTorch, LangChain, and more

What catches your interest?`;

function buildPromptWithContext(query: string, conversationHistory: Message[] = []): { prompt: string; hasContext: boolean } {
  const searchResult = searchKnowledgeBase(query);
  const context = formatContext(searchResult);
  
  // Build conversation summary for memory (last 4 exchanges max)
  const recentHistory = conversationHistory.slice(-8); // Last 4 user + 4 assistant messages
  let conversationMemory = '';
  
  if (recentHistory.length > 2) { // Only add if there's meaningful history
    const historyLines = recentHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'User' : 'You'}: ${msg.content.slice(0, 150)}${msg.content.length > 150 ? '...' : ''}`)
      .join('\n');
    
    conversationMemory = `
📝 RECENT CONVERSATION (for context continuity):
${historyLines}

Use this conversation history to:
- Maintain continuity and refer back to previous topics naturally
- Avoid repeating information you've already shared
- Build on previous answers when relevant
`;
  }
  
  if (context && searchResult.hasRelevantContent) {
    return {
      prompt: `${heroSystemPrompt}
${conversationMemory}
📖 KNOWLEDGE CONTEXT (retrieved via semantic search):
${context}

Use this context to answer. Stay within the scope of the provided information.`,
      hasContext: true
    };
  }
  
  // No relevant context found - will trigger out-of-scope response
  return {
    prompt: `${heroSystemPrompt}
${conversationMemory}`,
    hasContext: false
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body as { messages: Message[] };
    const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : '';

    // Build context-aware prompt using cosine similarity search + conversation memory
    const { prompt, hasContext } = buildPromptWithContext(lastUserMessage, messages);

    // If no relevant context found, return out-of-scope response without calling LLM
    // This saves API calls for irrelevant questions
    if (!hasContext && lastUserMessage.length > 0) {
      // Check if it's a greeting or simple interaction (allow these)
      const isGreeting = /^(hi|hello|hey|good\s*(morning|afternoon|evening)|what'?s?\s*up|howdy)/i.test(lastUserMessage.trim());
      const isAboutMe = /^(who\s*(are\s*you|is\s*ismail)|tell\s*me\s*about\s*(yourself|you)|introduce\s*yourself)/i.test(lastUserMessage.trim());
      const isEducation = /(master|degree|university|education|thesis|study|studies|bachelor|diploma|school|bicocca|milan)/i.test(lastUserMessage);
      const isExperience = /(experience|work|job|intern|liser|luxembourg|hospital|c2dh)/i.test(lastUserMessage);
      const isSkills = /(skill|python|pytorch|langchain|react|typescript|machine learning|deep learning|ai|data science)/i.test(lastUserMessage);
      const isProjects = /(project|split learning|rag|agent|food|classification|mlops)/i.test(lastUserMessage);
      
      if (!isGreeting && !isAboutMe && !isEducation && !isExperience && !isSkills && !isProjects) {
        return res.status(200).json({ reply: outOfScopeResponse });
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: 'OPENROUTER_API_KEY not configured' });
    }

    // Get the site URL for the Referer header
    const siteUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': siteUrl,
          'X-Title': 'Hero-Portfolio-Chatbot',
        },
        body: JSON.stringify({
          model: 'z-ai/glm-4.5-air:free',
          messages: [
            // Use RAG-enhanced system prompt with cosine similarity context
            { role: 'system', content: prompt },
            ...messages,
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('OpenRouter API error:', text);
      return res.status(500).json({
        error: 'LLM request failed',
        details: text,
      });
    }

    const data = await response.json();
    const reply: string = data.choices?.[0]?.message?.content ?? '';

    return res.status(200).json({ reply });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Chat API error:', errorMessage);
    return res.status(500).json({
      error: 'Server error',
      details: errorMessage,
    });
  }
}
