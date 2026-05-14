import OpenAI from 'openai'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/article-images')
mkdirSync(outDir, { recursive: true })

const client = new OpenAI({ apiKey: process.env.OPEN_API_KEY })

// gpt-image-2: no transparent bg support, use warm cream background to match brand
const BASE_STYLE = `Editorial illustration on a warm cream background (#F2EDE4).
Flat, graphic, painterly style — no gradients, no photorealism.
Color palette limited to: muted blue-purple (#534AB7), dusty mauve/rose (#B07FA8),
copper/terracotta line accents (#C07050), teal-green (#2D7A5F), amber (#EF9F27).
Organic flowing shapes, slightly surreal. No text, no human faces.
Inspired by anatomical poster art — organic forms, flowing line work, scientific illustration aesthetic.
Centered subject with generous breathing room. Square format.`

const SUBJECTS = {
  'una-manana-en-casa': 'Steam rising in flowing organic spirals from a coffee cup. Morning sunlight rendered as geometric rays through a window. Warm, quiet, domestic scene.',
  'en-el-parque': 'An organic tree silhouette with a flowing root system spreading below ground. Birds as minimal abstract curved shapes. Flowing lines suggest a gentle breeze.',
  'el-mercado': 'Floating fruit cross-sections — oranges, apples, and leaves arranged in a flowing organic composition with anatomical internal detail and line work.',
  'un-dia-de-trabajo': 'Abstract city skyline as overlapping geometric organic forms viewed from below. Windows as small glowing nodes connected by thin copper lines.',
  'el-viaje-en-tren': 'Rolling countryside hills as layered flowing wave forms, nested inside each other. A minimal train silhouette as a single clean flowing line cutting through.',
  'una-cena-con-amigos': 'A wine glass silhouette with organic flowing vines and grape clusters. Abstract candle flame as a flowing teardrop. Warm amber glow at center.',
}

const articles = [
  'una-manana-en-casa',
  'en-el-parque',
  'el-mercado',
  'un-dia-de-trabajo',
  'el-viaje-en-tren',
  'una-cena-con-amigos',
]

for (const slug of articles) {
  const prompt = `${BASE_STYLE}\n\nSubject: ${SUBJECTS[slug]}`
  console.log(`Generating: ${slug}...`)

  try {
    const response = await client.images.generate({
      model: 'gpt-image-2',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'medium',
    })

    const b64 = response.data[0].b64_json
    const buffer = Buffer.from(b64, 'base64')
    const outPath = join(outDir, `${slug}.png`)
    writeFileSync(outPath, buffer)
    console.log(`  ✓ Saved ${outPath}`)
  } catch (err) {
    console.error(`  ✗ Failed ${slug}:`, err.message)
  }
}

console.log('Done.')
