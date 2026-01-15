# Ismail Ahouari (Hero) Portfolio

A personal portfolio website for Ismail Ahouari, forked from Mitchell Sparrow's template. This version removes the Sanity CMS dependency and includes an AI "Hero Twin" chatbot powered by OpenRouter.

## Features

- **Modern Design**: Built with Next.js, Tailwind CSS, and Framer Motion
- **Static Data**: No external CMS required - all content is stored in the codebase
- **AI Chat Widget**: Floating avatar that opens a chat window with an AI twin powered by OpenRouter
- **Responsive**: Works on desktop and mobile devices

## Tech Stack

- Next.js 13 (Pages Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenRouter API (for AI chat)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- OpenRouter API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hero-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local and add your OpenRouter API key
```

4. Add your avatar image:
   - Place a square image named `hero-avatar.jpg` in the `public/` folder
   - This will be used for the hero section and chat widget

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | API key from [OpenRouter](https://openrouter.ai/) | Yes |

### Setting Up OpenRouter

1. Go to [https://openrouter.ai/](https://openrouter.ai/)
2. Create an account or sign in
3. Generate an API key
4. Add the key to your `.env.local` file

## Building for Production

```bash
npm run lint    # Check for linting errors
npm run build   # Build the application
npm run start   # Start the production server
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add the `OPENROUTER_API_KEY` environment variable in Vercel project settings
4. Deploy!

## Customizing Content

All portfolio content is defined in `pages/index.tsx` in the `getStaticProps` function:

- **pageInfo**: Name, role, bio, and profile images
- **experiences**: Work experience entries
- **skills**: Technical skills with proficiency levels
- **projects**: Portfolio projects with descriptions
- **socials**: Social media links

### Adding Images

Place images in the `public/images/` folder and reference them as `/images/filename.png`.

## AI Chat Widget

The floating chat widget in the bottom-right corner connects to OpenRouter's API using the `deepseek/deepseek-chat:free` model. The AI is configured to respond as "Hero", Ismail's AI twin.

### RAG (Retrieval-Augmented Generation)

The chatbot uses a **lightweight in-memory vector store** for context retrieval:

- **Knowledge Base**: `data/knowledge-base.json` - Add your documents here
- **Vector Store**: `lib/vectorStore.ts` - TF-IDF based similarity search
- **No External DB**: Everything runs in-memory, no setup required

#### How it works:
1. User sends a message
2. System searches knowledge base for relevant documents (top 3)
3. Relevant context is injected into the system prompt
4. LLM generates a response using the context

#### Adding Knowledge:
Edit `data/knowledge-base.json` to add more information:

```json
{
  "documents": [
    {
      "id": "unique-id",
      "category": "research|projects|experience|skills|contact",
      "content": "Your content here..."
    }
  ]
}
```

### PDF CV Ingestion

You can automatically populate the knowledge base by ingesting your CV/resume in PDF format:

#### Method 1: CLI Script (Recommended)
```bash
# Install dependencies first
npm install

# Ingest your CV
npm run ingest-pdf path/to/your-cv.pdf
```

#### Method 2: API Endpoint
```bash
# Upload via API (POST multipart/form-data)
curl -X POST -F "file=@your-cv.pdf" http://localhost:3000/api/ingest
```

The ingestion process:
1. Extracts text from the PDF
2. Splits content into semantic chunks (~500-600 chars each)
3. Adds chunks to `data/knowledge-base.json`
4. Old CV documents (prefixed with `cv_`) are replaced

**Note**: The PDF must contain selectable text. Scanned image-only PDFs won't work.

#### Testing the Knowledge Base:
```bash
# List all documents
curl http://localhost:3000/api/knowledge

# Search for relevant documents
curl "http://localhost:3000/api/knowledge?q=split+learning"
```

## Project Structure

```
├── components/          # React components
│   ├── ChatWidget.tsx   # AI chat widget
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   └── ...
├── data/
│   └── knowledge-base.json  # RAG knowledge base
├── lib/
│   ├── pdfParser.ts     # PDF parsing utilities
│   └── vectorStore.ts   # In-memory vector store
├── pages/
│   ├── index.tsx        # Main page with static data
│   └── api/
│       ├── chat.ts      # OpenRouter API proxy with RAG
│       ├── ingest.ts    # PDF ingestion endpoint
│       └── knowledge.ts # Knowledge base API
├── public/              # Static assets
│   ├── hero-avatar.jpg  # Your avatar image
│   └── images/          # Other images
├── scripts/
│   └── ingest-pdf.ts    # CLI script for PDF ingestion
├── styles/              # CSS styles
└── typings.d.ts         # TypeScript type definitions
```

## Credits


- AI chat powered by [OpenRouter](https://openrouter.ai/)

## License

MIT
