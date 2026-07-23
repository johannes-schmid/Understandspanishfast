import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'

// Model selection for the pack builder, in priority order:
//   1. Vercel AI Gateway  — when AI_GATEWAY_API_KEY is set (e.g. on Vercel)
//   2. Direct Anthropic   — when ANTHROPIC_API_KEY is set (e.g. local dev)
//   3. OpenAI fallback    — otherwise
const gatewayKey = process.env.AI_GATEWAY_API_KEY
const anthropicKey = process.env.ANTHROPIC_API_KEY
const anthropic = anthropicKey ? createAnthropic({ apiKey: anthropicKey }) : null
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

// gatewayId: dot-notation string routed through the AI Gateway.
// anthropicId: dash-notation id for the direct Anthropic API.
function pick(gatewayId, anthropicId, openaiId) {
  if (gatewayKey) return gatewayId
  if (anthropic) return anthropic(anthropicId)
  return openai(openaiId)
}

// The DurableAgent passes its model across a "use step" boundary (doStreamStep),
// so the model MUST be a serializable STRING id (resolved via the AI Gateway at
// run time) — a provider SDK instance throws "Failed to serialize step arguments".
// This means the agentic sources (url/pdf/srt) require AI_GATEWAY_API_KEY set,
// both on Vercel and for local `npm run dev`. (Topic packs don't use the agent.)
export const AGENT_MODEL = 'anthropic/claude-haiku-4.5'
// Stronger model used only for recovery reasoning (prepareStep escalation).
export const AGENT_MODEL_STRONG = 'anthropic/claude-sonnet-4.5'
// Higher-quality model for writing Spanish definitions/examples (one call per pack).
export const DEFINITION_MODEL = pick('anthropic/claude-sonnet-4.5', 'claude-sonnet-4-6', 'gpt-4o-mini')
// Topic packs generate vocabulary directly (used inside a step, so an instance is
// fine — no cross-step serialization). Mirrors the /api/ai/seed model choice.
export const TOPIC_MODEL = gatewayKey ? 'anthropic/claude-haiku-4.5' : openai('gpt-4o-mini')
