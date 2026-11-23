// Reads the central directory of the OPUS OpenSubtitles raw Spanish zips with HTTP range
// requests and returns, per IMDb number, the subtitle files available. Cached in the OS temp dir.
// Paths look like OpenSubtitles/raw/es/<year>/<imdb number>/<subtitle id>.xml
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const OPUS_URLS = {
  v2018: 'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2018/raw/es.zip',
  v2024: 'https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/raw/es.zip',
}
const CACHE = path.join(os.tmpdir(), 'mcs-coverage-cache')
fs.mkdirSync(CACHE, { recursive: true })

async function range(url, start, end) {
  const res = await fetch(url, { headers: { Range: `bytes=${start}-${end}` } })
  if (res.status !== 206) throw new Error(`range ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function centralDirectory(url) {
  const head = await fetch(url, { method: 'HEAD' })
  const size = Number(head.headers.get('content-length'))
  const tail = await range(url, size - 65536, size - 1)
  const eocd = tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  let cdOff = tail.readUInt32LE(eocd + 16)
  let cdSize = tail.readUInt32LE(eocd + 12)
  if (cdOff === 0xffffffff || cdSize === 0xffffffff) {
    const loc = tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x06, 0x07]))
    const z64 = Number(tail.readBigUInt64LE(loc + 8))
    const rec = await range(url, z64, z64 + 56)
    cdSize = Number(rec.readBigUInt64LE(40))
    cdOff = Number(rec.readBigUInt64LE(48))
  }
  const parts = []
  const STEP = 64 * 1024 * 1024
  for (let o = 0; o < cdSize; o += STEP) parts.push(await range(url, cdOff + o, cdOff + Math.min(o + STEP, cdSize) - 1))
  return Buffer.concat(parts)
}

function parse(cd, v) {
  const out = {}
  let p = 0
  while (p + 46 <= cd.length && cd.readUInt32LE(p) === 0x02014b50) {
    let cs = cd.readUInt32LE(p + 20)
    let us = cd.readUInt32LE(p + 24)
    const nl = cd.readUInt16LE(p + 28)
    const xl = cd.readUInt16LE(p + 30)
    const cl = cd.readUInt16LE(p + 32)
    let off = cd.readUInt32LE(p + 42)
    const name = cd.toString('utf8', p + 46, p + 46 + nl)
    let x = p + 46 + nl
    const xe = x + xl
    while (x + 4 <= xe) {
      const id = cd.readUInt16LE(x)
      const len = cd.readUInt16LE(x + 2)
      if (id === 1) {
        let q = x + 4
        if (us === 0xffffffff) { us = Number(cd.readBigUInt64LE(q)); q += 8 }
        if (cs === 0xffffffff) { cs = Number(cd.readBigUInt64LE(q)); q += 8 }
        if (off === 0xffffffff) { off = Number(cd.readBigUInt64LE(q)); q += 8 }
      }
      x += 4 + len
    }
    const m = name.match(/^OpenSubtitles\/raw\/es\/(\d{4})\/(\d+)\/(\d+)\.xml$/)
    if (m) (out[m[2]] ||= []).push({ v, path: name, cs, us, off, year: Number(m[1]) })
    p += 46 + nl + xl + cl
  }
  return out
}

export async function opusIndex() {
  const file = path.join(CACHE, 'opus-es-index.json')
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const index = {}
  for (const [v, url] of Object.entries(OPUS_URLS)) {
    const cd = await centralDirectory(url)
    const part = parse(cd, v)
    console.log(`${v}: ${Object.keys(part).length} titles, central directory ${(cd.length / 1e6).toFixed(0)} MB`)
    for (const [k, files] of Object.entries(part)) (index[k] ||= []).push(...files)
  }
  fs.writeFileSync(file, JSON.stringify(index))
  return index
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const idx = await opusIndex()
  console.log(`${Object.keys(idx).length} IMDb numbers indexed`)
}
