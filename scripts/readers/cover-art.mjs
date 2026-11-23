// Cover illustration: an apartment block at night. Each lit window holds a line drawing of one story.
export const ICONS = {
  1: '<rect x="-17" y="-11" width="34" height="23" rx="2"/><path d="M-17 -10 L0 3 L17 -10"/><path d="M8 6 h5"/>',
  2: '<rect x="-17" y="-10" width="34" height="23" rx="3"/><path d="M-14 -10 L8 -17 L11 -10"/><rect x="5" y="-3" width="12" height="9" rx="2"/><circle cx="10" cy="1.5" r="1.2"/>',
  3: '<path d="M-17 -3 Q0 -15 17 -3 l-1 5 h-7 l-1 -4 q-8 -3 -16 0 l-1 4 h-7 z"/><path d="M-10 4 h20 l3 10 h-26 z"/><circle cx="0" cy="9" r="2.5"/><path d="M-21 -11 l-3 -3 M21 -11 l3 -3 M0 -17 v-4"/>',
  4: '<path d="M-13 -14 h26 a3 3 0 0 1 3 3 v9 h-32 v-9 a3 3 0 0 1 3 -3z"/><path d="M-20 -6 h5 v14 h30 v-14 h5 v16 h-40 z"/><path d="M-16 10 v5 M16 10 v5"/>',
  5: '<rect x="-16" y="-7" width="32" height="21" rx="3"/><path d="M-6 -7 v-5 h12 v5"/><path d="M-8 -7 v21 M8 -7 v21"/><path d="M-22 14 h44"/>',
  6: '<path d="M-17 14 V-1 L0 -15 L17 -1 V14 Z"/><path d="M-20 1 L0 -18 L20 1"/><path d="M-6 14 V6 a6 6 0 0 1 12 0 V14"/><path d="M-22 14 h44"/>',
  7: '<path d="M-14 -15 h10 q0 12 -5 12 q-5 0 -5 -12z"/><path d="M-9 -3 v12 M-13 9 h8"/><path d="M4 -15 h10 q0 12 -5 12 q-5 0 -5 -12z"/><path d="M9 -3 v12 M5 9 h8"/><path d="M-22 14 h44"/>',
  8: '<path d="M-10 -16 l10 6 l10 -6"/><path d="M-3 -12 h6 l-2 4 l5 17 l-6 6 l-6 -6 l5 -17 z"/>',
  9: '<path d="M-16 -1 h32 v11 a4 4 0 0 1 -4 4 h-24 a4 4 0 0 1 -4 -4 z"/><path d="M-20 -1 h40 M-16 3 h-5 M16 3 h5 M-2 -4 h4"/><path d="M-7 -8 q-3 -4 0 -7 q3 -3 0 -7 M3 -8 q-3 -4 0 -7 q3 -3 0 -7"/>',
  10: '<rect x="-10" y="-17" width="20" height="33" rx="4"/><rect x="-6" y="-11" width="10" height="6" rx="2"/><rect x="-3" y="-2" width="10" height="6" rx="2"/><path d="M-2 11 h4"/>',
}

export const ICONS_2 = {
  1: '<ellipse cx="0" cy="-10" rx="14" ry="5"/><path d="M-14 -10 v8 a14 5 0 0 0 28 0 v-8"/><path d="M-14 -2 v8 a14 5 0 0 0 28 0 v-8"/><path d="M-14 6 v6 a14 5 0 0 0 28 0 v-6"/>',
  2: '<path d="M-16 14 V-2 L-3 -14 L10 -2 V14 Z"/><path d="M-8 14 v-9 h8 v9"/><path d="M17 14 V-6 M11 -6 h12 v9 h-12 z"/>',
  3: '<path d="M-18 6 v-6 l5 -9 h26 l5 9 v6 z"/><path d="M-4 -14 h8 v5 h-8z"/><circle cx="-10" cy="8" r="3.5"/><circle cx="10" cy="8" r="3.5"/><path d="M-12 -1 h24"/>',
  4: '<path d="M-20 0 h36 a4 4 0 0 1 0 4 h-36 z"/><path d="M2 0 l-9 -14 h6 l13 14 M2 4 l-9 12 h6 l13 -12 M-16 0 l-4 -8 h4 l5 8"/>',
  5: '<path d="M0 14 C-22 0 -14 -16 0 -6 C14 -16 22 0 0 14 z"/>',
  6: '<path d="M-18 8 v-6 a18 12 0 0 1 36 0 v6 z"/><path d="M-8 -6 l-3 6 M0 -8 l-3 7 M8 -6 l-3 6"/>',
  7: '<rect x="-17" y="-14" width="34" height="22" rx="2"/><path d="M-11 -6 h10 M-11 0 h16"/><path d="M-8 8 l-4 8 M8 8 l4 8"/>',
  8: '<rect x="-6" y="-4" width="12" height="18" rx="1"/><path d="M0 -4 v-4"/><path d="M0 -10 q-5 -5 0 -12 q5 7 0 12z"/><path d="M-14 14 h28"/>',
  9: '<circle cx="0" cy="4" r="11"/><path d="M-5 -7 l5 -8 l5 8 z"/>',
  10: '<path d="M-18 4 v-5 l6 -9 h22 l6 9 v5 z"/><circle cx="-10" cy="6" r="3.5"/><circle cx="10" cy="6" r="3.5"/><path d="M-22 15 h8 M-4 15 h8 M14 15 h8"/>',
}

const COLS = 5
const ROWS = 6
const LIT = { 1: [0, 1], 2: [0, 4], 3: [1, 0], 4: [1, 2], 5: [2, 3], 6: [3, 1], 7: [3, 4], 8: [4, 0], 9: [4, 2], 10: [5, 3] }

export function buildingSvg({ only } = {}) {
  const W = 600
  const H = 560
  const bx = 40
  const bw = 520
  const top = 46
  const ww = 72
  const wh = 60
  const gx = 26
  const gy = 16
  const x0 = bx + 28
  const y0 = top + 34
  const at = new Map(Object.entries(LIT).map(([n, [r, c]]) => [`${r}-${c}`, Number(n)]))
  let windows = ''
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = x0 + c * (ww + gx)
      const y = y0 + r * (wh + gy)
      const n = at.get(`${r}-${c}`)
      const lit = n && (!only || only === n)
      if (lit) {
        windows += `<g>
          <rect x="${x - 5}" y="${y - 5}" width="${ww + 10}" height="${wh + 10}" rx="6" fill="#ff8a55" opacity=".22" filter="url(#glow)"/>
          <rect x="${x}" y="${y}" width="${ww}" height="${wh}" rx="3" fill="url(#lamp)"/>
          <g transform="translate(${x + ww / 2} ${y + wh / 2 + 4}) scale(1.22)" fill="none" stroke="#14204a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</g>
          <text x="${x + 5}" y="${y + 11}" font-family="JetBrains Mono" font-size="8" font-weight="600" fill="#14204a" opacity=".55">${String(n).padStart(2, '0')}</text>
          <path d="M${x} ${y + wh} h${ww}" stroke="#0c1433" stroke-width="3"/>
        </g>`
      } else {
        const curtain = (r * 7 + c * 3) % 4 === 0
        windows += `<rect x="${x}" y="${y}" width="${ww}" height="${wh}" rx="3" fill="#0f1940" stroke="rgba(251,248,242,.07)"/>
          ${curtain ? `<path d="M${x + 4} ${y + 3} q8 ${wh / 2} 2 ${wh - 6} M${x + ww - 4} ${y + 3} q-8 ${wh / 2} -2 ${wh - 6}" stroke="rgba(251,248,242,.08)" stroke-width="1.5" fill="none"/>` : ''}
          <path d="M${x} ${y + wh} h${ww}" stroke="#0c1433" stroke-width="3"/>`
      }
    }
  }
  const stars = [[70, 18], [150, 30], [260, 12], [420, 26], [520, 10], [575, 36], [30, 40], [350, 34]]
    .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1 : 1.6}" fill="#fbf8f2" opacity="${i % 2 ? .35 : .6}"/>`).join('')
  return `<svg class="cv-art" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An apartment building at night with ten lit windows, one for each story">
    <defs>
      <linearGradient id="lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc79a"/><stop offset="1" stop-color="#ff9a62"/></linearGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131f4b" stop-opacity="0"/><stop offset="1" stop-color="#131f4b"/></linearGradient>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22336f"/><stop offset="1" stop-color="#1a2858"/></linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>
    ${stars}
    <path d="M500 0 a28 28 0 1 0 28 40 a22 22 0 1 1 -28 -40z" fill="#fbf8f2" opacity=".85" transform="translate(-6 4)"/>
    <path d="M150 ${top} v-22 M150 ${top - 14} h-16 M150 ${top - 20} h12 M420 ${top} v-16 h18 v16" stroke="#22336f" stroke-width="3" fill="none"/>
    <rect x="${bx - 8}" y="${top - 8}" width="${bw + 16}" height="10" rx="2" fill="#2a3c7c"/>
    <rect x="${bx}" y="${top}" width="${bw}" height="${H - top}" fill="url(#wall)"/>
    ${windows}
    <rect x="0" y="${H - 90}" width="${W}" height="90" fill="url(#fade)"/>
  </svg>`
}

function litWindow(x, y, w, h, n, s, icons = ICONS) {
  return `<rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="6" fill="#ff8a55" opacity=".22" filter="url(#glow)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#lamp)"/>
    <g transform="translate(${x + w / 2} ${y + h / 2 + 3}) scale(${s})" fill="none" stroke="#14204a" stroke-width="${(1.9 / s) * 1.22}" stroke-linecap="round" stroke-linejoin="round">${icons[n]}</g>
    <text x="${x + 4}" y="${y + 10}" font-family="JetBrains Mono" font-size="7.5" font-weight="600" fill="#14204a" opacity=".55">${String(n).padStart(2, '0')}</text>`
}

// Cover illustration: a pop-up city rising out of an open book, a sound wave across the sky. One lit window per story.
export function popupSvg({ only, level = 1 } = {}) {
  const icons = level === 2 ? ICONS_2 : ICONS
  const ww = 46
  const wh = 40
  const B = [
    { x: 64, w: 98, top: 246, fill: '#1d2c62', col: 90, rows: [268, 324, 380], lit: { 0: 1, 1: 10 } },
    { x: 168, w: 102, top: 126, fill: '#22336f', col: 196, rows: [148, 204, 260, 316, 372], lit: { 0: 2, 2: 3 } },
    { x: 276, w: 98, top: 54, fill: '#2a3c7c', col: 302, rows: [76, 132, 188, 244, 300, 356], lit: { 0: 4, 2: 5, 4: 6 } },
    { x: 380, w: 102, top: 150, fill: '#22336f', col: 408, rows: [172, 228, 284, 340], lit: { 0: 7, 2: 8 } },
    { x: 488, w: 72, top: 270, fill: '#1d2c62', col: 501, rows: [292, 348], lit: { 0: 9 } },
  ]
  const stars = [[70, 18], [150, 30], [260, 12], [420, 26], [520, 10], [575, 36], [30, 40], [350, 34]]
    .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1 : 1.6}" fill="#fbf8f2" opacity="${i % 2 ? .35 : .6}"/>`).join('')
  const wave = Array.from({ length: 57 }, (_, i) => {
    const h = 8 + Math.abs(Math.sin(i * 0.55) * 46 + Math.sin(i * 1.7) * 18)
    return `<rect x="${20 + i * 10}" y="${(210 - h / 2).toFixed(1)}" width="4" height="${h.toFixed(1)}" rx="2"/>`
  }).join('')
  let city = ''
  for (const b of B) {
    city += `<rect x="${b.x - 4}" y="${b.top - 7}" width="${b.w + 8}" height="9" rx="2" fill="#33478c"/><rect x="${b.x}" y="${b.top}" width="${b.w}" height="${470 - b.top}" fill="${b.fill}"/>`
    b.rows.forEach((y, r) => {
      const n = b.lit[r]
      city += n && (!only || only === n)
        ? litWindow(b.col, y, ww, wh, n, 0.86, icons)
        : `<rect x="${b.col}" y="${y}" width="${ww}" height="${wh}" rx="3" fill="#0f1940" stroke="rgba(251,248,242,.07)"/>`
    })
  }
  const lines = (d) => Array.from({ length: 4 }, (_, i) => `<path d="M${300 + d * 30} ${462 + i * 13} C${300 + d * 110} ${452 + i * 12} ${300 + d * 180} ${450 + i * 12} ${300 + d * 220} ${456 + i * 12}" stroke="#d9ddf0" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')
  return `<svg class="cv-art" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A pop-up city rising from an open book, with a sound wave across the night sky and one lit window for each story">
    <defs>
      <linearGradient id="lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc79a"/><stop offset="1" stop-color="#ff9a62"/></linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>
    ${stars}
    <path d="M0 0 a28 28 0 1 0 28 40 a22 22 0 1 1 -28 -40z" fill="#fbf8f2" opacity=".85" transform="translate(70 4) scale(.9)"/>
    <g fill="#f26b3a" opacity=".32">${wave}</g>
    ${city}
    <path d="M44 444 L44 540 C150 520 240 522 300 548 C360 522 450 520 556 540 L556 444 Z" fill="#f26b3a"/>
    <path d="M300 446 C240 422 150 420 56 436 L56 528 C150 512 240 514 300 538 Z" fill="#fbf8f2"/>
    <path d="M300 446 C360 422 450 420 544 436 L544 528 C450 512 360 514 300 538 Z" fill="#f3efe6"/>
    ${lines(-1)}${lines(1)}
    <path d="M300 446 V538" stroke="#c9c3b6" stroke-width="2"/>
  </svg>`
}
