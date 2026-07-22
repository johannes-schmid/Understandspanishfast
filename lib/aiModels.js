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

// Fast/cheap model for the agent's orchestration loop.
export const AGENT_MODEL = pick('anthropic/claude-haiku-4.5', 'claude-haiku-4-5', 'gpt-4o-mini')
// Stronger model used only for recovery reasoning (prepareStep escalation).
export const AGENT_MODEL_STRONG = pick('anthropic/claude-sonnet-4.5', 'claude-sonnet-4-6', 'gpt-4o')
// Higher-quality model for writing Spanish definitions/examples (one call per pack).
export const DEFINITION_MODEL = pick('anthropic/claude-sonnet-4.5', 'claude-sonnet-4-6', 'gpt-4o-mini')
