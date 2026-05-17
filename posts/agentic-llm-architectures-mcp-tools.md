---
title: "Agentic LLM Architectures and MCP Tools"
date: "2025-01-10"
readTime: "7 min read"
excerpt: "How Model Context Protocol tools, ReAct agents, and Cloudflare Durable Objects come together to build stateful, multi-tenant LLM infrastructure that scales without losing session context."
tags: ["Agents", "MCP", "Cloudflare"]
coverImage: "/images/langgraph-logo-white.png"
---

## From Chatbots to Agents

A chatbot answers questions. An agent acts on them.

The distinction seems subtle but the engineering implications are dramatic. A chatbot needs a language model and a prompt. An agent needs a language model, a tool registry, a planning loop, memory persistence, error recovery, and if it operates at scale multi-tenant isolation and session continuity.

This post walks through the architecture of a production-grade agentic LLM system built on Cloudflare's edge infrastructure, using the **Model Context Protocol (MCP)** as the tool interface standard.

## The ReAct Loop

The cognitive backbone of most modern agents is the **ReAct** (Reason + Act) pattern, introduced by Yao et al.:

```
┌─────────────────────────────────────────────┐
│  THINK: "I need to check the weather"        │
│  ACT:   call weather_tool(location="Milan")  │
│  OBSERVE: { temp: 18, condition: "cloudy" }  │
│  THINK: "Now I can answer the user"           │
│  RESPOND: "It's 18°C and cloudy in Milan."   │
└─────────────────────────────────────────────┘
```

The loop continues until the model decides it has enough information to produce a final response, or until a maximum iteration count is reached (to prevent infinite loops).

Implementing this with a raw LLM API is straightforward:

```python
async def react_loop(user_query: str, tools: list[Tool], max_steps: int = 10):
    messages = [{"role": "user", "content": user_query}]
    
    for step in range(max_steps):
        response = await llm.complete(
            messages=messages,
            tools=[t.schema for t in tools],
        )
        
        if response.finish_reason == "stop":
            return response.content  # Final answer
        
        if response.finish_reason == "tool_calls":
            for call in response.tool_calls:
                tool = get_tool(call.name)
                result = await tool.execute(call.arguments)
                messages.append({"role": "tool", "content": result, "tool_call_id": call.id})
    
    raise MaxStepsExceeded()
```

## Model Context Protocol (MCP)

MCP is Anthropic's open standard for defining how LLMs interact with external tools and resources. It separates the *what* (tool definitions, input/output schemas) from the *how* (transport, authentication, server implementation).

An MCP tool definition looks like this:

```json
{
  "name": "search_knowledge_base",
  "description": "Search the internal knowledge base for relevant documents",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "The search query" },
      "limit": { "type": "integer", "default": 5 }
    },
    "required": ["query"]
  }
}
```

The benefit of MCP over ad-hoc tool definitions is **composability**. Tools become reusable modules. An MCP server can expose a set of tools that any MCP-compatible agent can discover and call no custom integration per agent.

### MCP Transport Modes

| Mode | Use Case |
|---|---|
| `stdio` | Local CLI agents, single-process setups |
| `HTTP + SSE` | Web-hosted agents, real-time streaming |
| `WebSocket` | Bidirectional, low-latency agent communication |

For production web deployments, HTTP with Server-Sent Events (SSE) gives the best balance of simplicity and real-time responsiveness.

## Cloudflare Durable Objects for Session State

Stateless edge functions are fast and scalable, but agents are inherently stateful. A conversation has history. A long-running task has intermediate state. A multi-step workflow has partially-completed actions.

**Durable Objects** (DO) are Cloudflare's solution: a single-instance, globally-unique JavaScript class that runs at the edge, closest to the user who owns that session. Each session gets its own DO instance, with:

- **Persistent storage:** Key-value store persisted across requests
- **Strong consistency:** All requests to a DO run serially, no race conditions
- **Geographic affinity:** DO migrates to the region where it's accessed most

```typescript
export class AgentSession extends DurableObject {
  private history: Message[] = [];
  private tools: MCPClient;

  async fetch(request: Request): Promise<Response> {
    const { query } = await request.json();
    
    // History automatically persists across requests
    this.history.push({ role: "user", content: query });
    
    const response = await this.runReActLoop(query);
    this.history.push({ role: "assistant", content: response });
    
    // Persist to storage
    await this.ctx.storage.put("history", this.history);
    
    return Response.json({ response });
  }
}
```

Each user gets their own `AgentSession` instance, identified by a session ID. Isolation is guaranteed no cross-tenant data leakage, no shared state.

## Multi-Tenant Architecture

Production agentic systems serve many users simultaneously. The challenge: give each user isolated state while sharing the expensive resources (LLM API calls, vector stores, MCP server connections).

```
                        ┌──────────────┐
User A ─────────────────▶  DO Instance │ ← Session A history
                         │  (edge CDN) │ ← Session A tool calls
                        └──────┬───────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Shared Resources   │
                    │  ──────────────────  │
                    │  LLM API (rate-lim.) │
                    │  MCP Tool Servers    │
                    │  Vector Store        │
                    └──────────────────────┘
                               ▲
                        ┌──────┴───────┐
User B ─────────────────▶  DO Instance │ ← Session B history
                         │  (edge CDN) │
                        └──────────────┘
```

Shared resources are accessed via **Workers** (stateless request handlers) that enforce per-user rate limiting before touching the LLM API. This prevents any single user from exhausting the quota.

## Real-Time Streaming with SSE

Waiting 10 seconds for a complete agent response is a poor user experience. Streaming intermediate output tool call decisions, thinking steps, partial responses dramatically improves perceived performance.

Server-Sent Events stream tokens from the Durable Object back to the client:

```typescript
async *streamReActLoop(query: string): AsyncGenerator<string> {
  for await (const step of this.agent.run(query)) {
    if (step.type === "thinking") {
      yield `data: ${JSON.stringify({ type: "think", content: step.text })}\n\n`;
    }
    if (step.type === "tool_call") {
      yield `data: ${JSON.stringify({ type: "tool", name: step.tool })}\n\n`;
    }
    if (step.type === "response") {
      for (const token of step.tokens) {
        yield `data: ${JSON.stringify({ type: "token", content: token })}\n\n`;
      }
    }
  }
}
```

The client renders thinking steps and tool calls as they arrive, giving a sense of the agent's reasoning process which also builds user trust.

## Lessons Learned

**Tools fail. Build recovery.** Network timeouts, API rate limits, malformed responses agents must handle tool failures gracefully. Build retry logic with exponential backoff into every tool wrapper, not the agent loop.

**Context window is a budget.** Every message in the history, every tool result, every system prompt consumes tokens. Implement **context compression**: summarize old history when the window approaches its limit. LLMs are good at summarization use them to manage their own context.

**Determinism matters for debugging.** Agents are non-deterministic by nature, but logging every ReAct step (thought, tool call, observation) as a structured trace makes debugging tractable. Treat agent traces the way you treat distributed system traces: correlation IDs, timestamps, structured JSON.

**Eval before you scale.** Define a set of canonical test queries with expected behaviors before deploying. Automated evals catch regressions when you update the prompt, change models, or add new tools.

---

*The agentic infrastructure described here powers several AI automation projects. The full architecture with MCP tool definitions is available on [GitHub](https://github.com/SameulAH).*
