import { DurableAgent } from '@workflow/ai/agent'
import { getWritable } from 'workflow'
import { z } from 'zod'
import {
  fetchUrlStep, extractPdfStep, searchSubtitlesStep, downloadSubtitlesStep,
  analyzeTextStep, generateDefinitionsStep, savePackStep, TARGET,
} from '@/lib/packTools'
import { AGENT_MODEL, AGENT_MODEL_STRONG } from '@/lib/aiModels'

function describeSource(source) {
  if (source.type === 'url') {
    return `Build a Spanish vocabulary pack from this web page: ${source.url}

Steps: call fetchUrl with that URL. If it returns ok:false or langGuess is not "es", explain briefly that you couldn't build a pack and stop. Otherwise call analyzeText with the returned sourceRef, then generateDefinitions with the candidatesRef, then savePack with a short descriptive title (name the topic of the page).`
  }
  if (source.type === 'pdf') {
    return `Build a Spanish vocabulary pack from the uploaded PDF document (filename: ${source.label || 'document.pdf'}).

Steps: call extractPdf (it takes no arguments). If ok:false, explain and stop. Otherwise call analyzeText with the sourceRef, then generateDefinitions with the candidatesRef, then savePack with a short descriptive title.`
  }
  const ep = source.season != null || source.episode != null
    ? ` (season ${source.season ?? '?'}, episode ${source.episode ?? '?'})` : ''
  return `Build a Spanish vocabulary pack from subtitles for the series "${source.query}"${ep}.

Steps: call searchSubtitles. From the results, choose the single BEST Spanish subtitle: prefer a Spanish (language "ES") result whose releaseName matches the requested title and season/episode; avoid hearing-impaired versions unless nothing else fits. Call downloadSubtitles with that result's url. If it fails, try the next-best result once. Then call analyzeText with the sourceRef, generateDefinitions with the candidatesRef, and savePack with a short descriptive title (include the series name).`
}

export async function buildPackWorkflow({ userId, buildId, source }) {
  'use workflow'

  const agent = new DurableAgent({
    model: AGENT_MODEL,
    instructions: `You are an agent that builds a Spanish vocabulary study pack from a source the user provides.

You orchestrate tools; you do NOT do the linguistic work yourself. Deterministic tools handle text extraction, frequency analysis, exclusion of already-known words, and definition writing — never invent, translate, or filter words yourself.

Rules:
- Always finish by calling savePack. The task is done once a pack is saved.
- Aim for a pack of ${TARGET.min}-${TARGET.max} words. If analyzeText reports fewer than ${TARGET.min} new words, you MAY acquire one more source (another URL, or the next episode) and analyze it too before saving — but only once. If still low, save what you have.
- If a source is unusable (ok:false, wrong language, empty), briefly explain and stop without saving.
- Choose a concise, human title for the pack describing the source content.
- Recoverable tool failures come back as { ok:false, reason }. React to them; do not repeat the exact same failing call.`,
    tools: {
      fetchUrl: {
        description: 'Fetch and extract readable text from a web page URL.',
        inputSchema: z.object({ url: z.string().describe('the page URL') }),
        execute: ({ url }) => fetchUrlStep(buildId, url),
      },
      extractPdf: {
        description: 'Extract text from the uploaded PDF document. Takes no arguments.',
        inputSchema: z.object({}),
        execute: () => extractPdfStep(buildId, source.storagePath),
      },
      searchSubtitles: {
        description: 'Search Subdl for Spanish subtitle files for a series or movie. Returns candidates with release names, language, and season/episode.',
        inputSchema: z.object({
          query: z.string(),
          season: z.number().optional(),
          episode: z.number().optional(),
        }),
        execute: (input) => searchSubtitlesStep(input),
      },
      downloadSubtitles: {
        description: 'Download the subtitle archive for a chosen result and extract its dialogue text.',
        inputSchema: z.object({ url: z.string().describe('the url field from a searchSubtitles result') }),
        execute: ({ url }) => downloadSubtitlesStep(buildId, url),
      },
      analyzeText: {
        description: 'Analyze extracted source text: rank vocabulary, exclude words the learner already knows and the most basic words. Returns counts and a candidatesRef.',
        inputSchema: z.object({ sourceRef: z.string().describe('sourceRef from a fetch/extract/download tool') }),
        execute: ({ sourceRef }) => analyzeTextStep(buildId, sourceRef, userId),
      },
      generateDefinitions: {
        description: 'Write dictionary definitions and example sentences for the new non-corpus words. Returns an entriesRef.',
        inputSchema: z.object({ candidatesRef: z.string() }),
        execute: ({ candidatesRef }) => generateDefinitionsStep(buildId, candidatesRef, userId),
      },
      savePack: {
        description: 'Persist the final vocabulary pack. Call last, with a short human title.',
        inputSchema: z.object({
          candidatesRef: z.string(),
          entriesRef: z.string().optional(),
          title: z.string(),
        }),
        execute: ({ candidatesRef, entriesRef, title }) =>
          savePackStep(buildId, {
            candidatesRef, entriesRef, title,
            sourceType: source.type,
            sourceLabel: source.label || source.url || source.query || null,
          }, userId),
      },
    },
  })

  const result = await agent.stream({
    messages: [{ role: 'user', content: describeSource(source) }],
    writable: getWritable(),
    maxSteps: 16,
    prepareStep: ({ stepNumber }) =>
      stepNumber > 5 ? { model: AGENT_MODEL_STRONG } : {},
  })

  return result.messages
}
