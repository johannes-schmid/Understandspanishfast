import { getWritable } from 'workflow'

// Human-readable progress events for the pack builder UI, streamed on a dedicated
// namespace so the client can render a live checklist independent of the agent's
// internal UIMessage stream. Called from inside "use step" tool bodies.
export async function emitProgress(event) {
  const writer = getWritable({ namespace: 'progress' }).getWriter()
  try {
    await writer.write({ ...event, ts: Date.now() })
  } finally {
    writer.releaseLock()
  }
}
