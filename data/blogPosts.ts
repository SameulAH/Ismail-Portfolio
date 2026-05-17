import { BlogPost } from "../typings";

export const blogPosts: BlogPost[] = [
  {
    slug: "split-learning-privacy-preserving-distributed-deep-learning",
    title: "Split Learning: Privacy-Preserving Distributed Deep Learning",
    date: "2025-04-15",
    readTime: "8 min read",
    excerpt:
      "An in-depth look at Vanilla SL, U-Shaped SL, and SplitFed — how they distribute model layers across clients and servers to keep raw data local while still training powerful neural networks.",
    tags: ["Distributed ML", "Privacy", "Deep Learning"],
    coverImage: "/images/slperf-project.png",
  },
  {
    slug: "building-production-rag-system-from-scratch",
    title: "Building a Production-Grade RAG System from Scratch",
    date: "2025-02-28",
    readTime: "10 min read",
    excerpt:
      "From chunking strategies and embedding selection to vector store tuning and LLM orchestration — a practical walkthrough of the architectural decisions behind a robust Retrieval-Augmented Generation pipeline.",
    tags: ["LLM", "RAG", "FastAPI"],
    coverImage: "/images/rag-chatbot-project.png",
  },
  {
    slug: "agentic-llm-architectures-mcp-tools",
    title: "Agentic LLM Architectures and MCP Tools",
    date: "2025-01-10",
    readTime: "7 min read",
    excerpt:
      "How Model Context Protocol tools, ReAct agents, and Cloudflare Durable Objects come together to build stateful, multi-tenant LLM infrastructure that scales without losing session context.",
    tags: ["Agents", "MCP", "Cloudflare"],
    coverImage: "/images/langgraph-logo-white.png",
  },
];
