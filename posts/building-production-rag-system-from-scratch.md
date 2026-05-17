---
title: "Building a Production-Grade RAG System from Scratch"
date: "2025-02-28"
readTime: "10 min read"
excerpt: "From chunking strategies and embedding selection to vector store tuning and LLM orchestration a practical walkthrough of the architectural decisions behind a robust Retrieval-Augmented Generation pipeline."
tags: ["LLM", "RAG", "FastAPI"]
coverImage: "/images/rag-chatbot-project.png"
---

## Why RAG?

Large language models have a fixed knowledge cutoff and a finite context window. Fine-tuning is expensive, brittle to data drift, and doesn't scale to knowledge that changes frequently. Retrieval-Augmented Generation solves this by giving the model a dynamic, queryable external memory your documents, your database, your organization's knowledge base at inference time.

The idea is simple: before answering a question, retrieve the most relevant passages from your corpus and inject them into the prompt. The model's job shifts from *knowing* the answer to *synthesizing* it from retrieved evidence.

Simple in theory. Surprisingly complex in production.

## System Architecture Overview

A production RAG pipeline has five distinct stages:

```
Query
  │
  ▼
[1. Query Processing]     rewrite, expand, classify intent
  │
  ▼
[2. Retrieval]            dense + sparse hybrid search
  │
  ▼
[3. Re-ranking]           cross-encoder scoring
  │
  ▼
[4. Context Assembly]     pack retrieved chunks into prompt
  │
  ▼
[5. Generation]           LLM produces grounded response
```

Each stage has decisions that materially affect output quality. Let's go through them.

## Stage 1: Document Ingestion and Chunking

Before retrieval, you need to embed your documents. This starts with chunking splitting documents into pieces small enough to embed meaningfully but large enough to contain coherent information.

### Chunking strategies

**Fixed-size chunking** splits every N tokens with an overlap of K. Simple, predictable, but semantically unaware a sentence about one topic can span two chunks.

```python
def chunk_fixed(text: str, size: int = 512, overlap: int = 64) -> list[str]:
    tokens = tokenizer.encode(text)
    chunks = []
    for i in range(0, len(tokens), size - overlap):
        chunks.append(tokenizer.decode(tokens[i : i + size]))
    return chunks
```

**Recursive character text splitting** (LangChain's default) tries to split on paragraph boundaries first, then sentences, then words. Better semantic coherence in practice.

**Semantic chunking** embeds every sentence, then splits where cosine similarity between adjacent sentences drops below a threshold. Produces semantically coherent chunks but is slower and harder to tune.

For most document types, recursive splitting with a 512-token size and 10% overlap is a strong default. Adjust based on your document structure shorter chunks for dense technical text, longer for narrative content.

### Embedding model selection

The embedding model is the most important decision in your RAG system. A weak embedder produces poor retrievals that no amount of re-ranking can recover.

| Model | Dim | MTEB Score | Notes |
|---|---|---|---|
| `text-embedding-3-small` | 1536 | 62.3 | OpenAI, fast, cheap |
| `all-mpnet-base-v2` | 768 | 57.8 | Open-source, self-hostable |
| `bge-large-en-v1.5` | 1024 | 64.2 | Best open-source for English |
| `e5-mistral-7b` | 4096 | 66.6 | Expensive, very high quality |

For the portfolio chatbot I built, `all-mpnet-base-v2` via Sentence-Transformers hit a good balance of quality and latency for self-hosted inference.

## Stage 2: Vector Storage and Retrieval

### ChromaDB setup

ChromaDB is a solid choice for projects under ~1M documents. It runs in-process (no server overhead), persists to disk, and has a clean Python API.

```python
import chromadb
from chromadb.utils import embedding_functions

ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-mpnet-base-v2"
)

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(
    name="portfolio_knowledge",
    embedding_function=ef,
    metadata={"hnsw:space": "cosine"},
)
```

**Critical parameter:** `hnsw:space`. Default is L2 distance. For text embeddings, cosine similarity is almost always better. Set this at collection creation it cannot be changed after.

### Hybrid retrieval

Pure dense retrieval (vector similarity) misses exact keyword matches. Pure sparse retrieval (BM25) misses semantic similarity. Hybrid retrieval combines both:

```python
def hybrid_search(query: str, k: int = 5) -> list[Document]:
    dense_results = collection.query(
        query_texts=[query],
        n_results=k * 2,  # over-fetch for re-ranking
    )
    sparse_results = bm25_index.search(query, k=k * 2)

    # Reciprocal Rank Fusion
    return rrf_merge(dense_results, sparse_results, k=k)
```

Reciprocal Rank Fusion (RRF) is a parameter-free merging strategy that tends to outperform weighted linear combinations in practice.

## Stage 3: Re-ranking

Initial retrieval casts a wide net. Re-ranking scores each candidate more precisely using a cross-encoder a model that jointly processes the query and each document as a pair (unlike bi-encoders which embed them separately).

Cross-encoders are slower (can't pre-compute document embeddings) but significantly more accurate. Apply them only to the top-K from retrieval, not the full corpus.

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank(query: str, candidates: list[str], k: int = 3) -> list[str]:
    pairs = [(query, doc) for doc in candidates]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(scores, candidates), reverse=True)
    return [doc for _, doc in ranked[:k]]
```

## Stage 4: Context Assembly

How you pack retrieved chunks into the prompt matters more than most people think.

**Lost in the middle:** LLMs attend better to content at the beginning and end of the context window than the middle. Put the most relevant chunk first, not in the middle.

**Context window budgeting:** Reserve tokens for the system prompt, the user query, and the response. With a 16K context LLM, a reasonable allocation:

- System prompt: ~500 tokens
- Retrieved context: ~8000 tokens  
- User query: ~200 tokens
- Response buffer: ~2000 tokens

**Source attribution:** Include document metadata (file name, section, page) in each chunk's prefix. The model will naturally include citations if you ask it to.

```python
def assemble_context(chunks: list[Chunk]) -> str:
    parts = []
    for i, chunk in enumerate(chunks, 1):
        parts.append(
            f"[Source {i}: {chunk.metadata['source']}, p.{chunk.metadata.get('page', '?')}]\n"
            f"{chunk.text}"
        )
    return "\n\n---\n\n".join(parts)
```

## Stage 5: FastAPI Orchestration

The full pipeline wraps into a clean FastAPI endpoint:

```python
@app.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    # 1. Retrieve
    candidates = hybrid_search(request.query, k=10)
    
    # 2. Re-rank
    top_chunks = rerank(request.query, candidates, k=3)
    
    # 3. Assemble
    context = assemble_context(top_chunks)
    
    # 4. Generate
    response = await llm_client.complete(
        system=SYSTEM_PROMPT,
        context=context,
        query=request.query,
        history=request.history,
    )
    
    return ChatResponse(answer=response.text, sources=top_chunks)
```

## What Actually Goes Wrong

**Retrieval failures** are the most common issue. If the right document isn't in the top-K, no prompt engineering will fix the answer. Invest in retrieval quality first add query expansion, tune chunk size, check your embedding model.

**Hallucination in the presence of partial context.** The model has a retrieved chunk about topic A and is asked about topic B. It may blend the two. Explicit prompting helps: *"If the answer is not in the retrieved context, say so."*

**Chunk boundary artifacts.** A sentence starts in chunk N and ends in chunk N+1. Retrieval returns N, the model sees a truncated sentence. Overlap mitigates this; consider sentence-aware splitting.

**Latency.** Cross-encoder re-ranking adds 200–400ms. Cache embeddings aggressively, run re-ranking in parallel if your framework supports it, and consider async generation with streaming for perceived latency.

---

*The RAG chatbot powering this portfolio's AI widget is built on this exact architecture. Feel free to test it ask it anything about my background, projects, or research.*
