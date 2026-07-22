// Email rendering primitives. Everything is table-based with inline styles —
// Gmail strips <style> blocks and flexbox/grid are unreliable across clients.
// Colours mirror the tokens in app/globals.css; fonts fall back to email-safe
// stacks because Fraunces and Cabinet Grotesk cannot load in a mail client.

export const C = {
  cream: '#F2EDE4',
  creamDark: '#E8E0D4',
  paper: '#FAF7F2',
  ink: '#1C1A3A',
  muted: '#7B7FA8',
  sand: '#A49C8C',
  synapse: '#534AB7',
  signal: '#2D7A5F',
  signalLight: '#E1F5EE',
  gold: '#D59A2B',
  iris: '#6B66C9',
  lilac: '#E2E0F4',
  hair: 'rgba(28,26,58,0.08)',
}

const SERIF = "Georgia, 'Times New Roman', Times, serif"
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mostcommonspanish.com'

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Campaign tracking so returning traffic is attributable in GA.
export function link(path, emailKey) {
  const sep = path.includes('?') ? '&' : '?'
  return `${SITE}${path}${sep}utm_source=email&utm_medium=lifecycle&utm_campaign=${emailKey}`
}

export function h1(text) {
  return `<h1 style="margin:0 0 14px;font-family:${SERIF};font-size:27px;line-height:1.25;font-weight:700;color:${C.ink};">${text}</h1>`
}

export function h2(text) {
  return `<h2 style="margin:30px 0 12px;font-family:${SERIF};font-size:19px;line-height:1.3;font-weight:700;color:${C.ink};">${text}</h2>`
}

export function p(text, opts = {}) {
  const color = opts.muted ? C.muted : C.ink
  const size = opts.small ? '14px' : '16px'
  return `<p style="margin:0 0 16px;font-family:${SANS};font-size:${size};line-height:1.65;color:${color};">${text}</p>`
}

export function eyebrow(text) {
  return `<p style="margin:0 0 10px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${C.sand};">${text}</p>`
}

export function divider() {
  return `<div style="height:1px;background:${C.hair};margin:28px 0;line-height:1px;font-size:0;">&nbsp;</div>`
}

export function button({ href, label }) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
  <tr><td style="border-radius:10px;background:${C.ink};">
    <a href="${href}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:15px;font-weight:500;color:${C.paper};text-decoration:none;border-radius:10px;">${label}</a>
  </td></tr>
</table>`
}

// Three big numerals. Flat and typographic — no badges, no XP, no gamification.
export function statRow(stats) {
  const cells = stats.map(s => `
    <td width="33%" align="center" style="padding:4px 6px;">
      <div style="font-family:${SERIF};font-size:30px;font-weight:700;line-height:1.1;color:${s.color};">${s.value}</div>
      <div style="font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${C.sand};padding-top:5px;">${s.label}</div>
    </td>`).join('')

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px;background:${C.cream};border-radius:14px;">
  <tr><td style="padding:20px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>
  </td></tr>
</table>`
}

// Two nested cells rather than an image — renders everywhere, no asset to block.
export function progressBar({ pct, caption }) {
  const width = Math.max(2, Math.min(100, Math.round(pct)))
  const cap = caption
    ? `<div style="font-family:${SANS};font-size:12px;color:${C.sand};padding-top:9px;">${caption}</div>`
    : ''

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;">
  <tr><td>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.creamDark};border-radius:99px;">
      <tr><td>
        <table role="presentation" width="${width}%" cellpadding="0" cellspacing="0" border="0" style="background:${C.synapse};border-radius:99px;">
          <tr><td style="height:10px;line-height:10px;font-size:0;">&nbsp;</td></tr>
        </table>
      </td></tr>
    </table>
    ${cap}
  </td></tr>
</table>`
}

export function wordCard(word) {
  const meanings = Array.isArray(word.meanings) ? word.meanings.join(', ') : word.meanings

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;background:${C.cream};border-radius:12px;">
  <tr><td style="padding:16px 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="font-family:${SERIF};font-size:20px;font-weight:700;color:${C.ink};">${esc(word.word)}</td>
        <td align="right" style="font-family:${SANS};font-size:11px;color:${C.sand};">#${word.rank} · ${esc(word.pos || '')}</td>
      </tr>
    </table>
    <div style="font-family:${SANS};font-size:14px;color:${C.muted};padding:3px 0 10px;">${esc(meanings)}</div>
    <div style="font-family:${SANS};font-size:14px;font-style:italic;color:${C.synapse};line-height:1.5;">${esc(word.example_es)}</div>
    <div style="font-family:${SANS};font-size:13px;color:${C.sand};line-height:1.5;padding-top:2px;">${esc(word.example_en)}</div>
  </td></tr>
</table>`
}

export function articleRow({ title, description, readiness, href }) {
  const ready = readiness >= 80 ? C.signal : C.gold

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;background:${C.cream};border-radius:12px;">
  <tr><td style="padding:16px 18px;">
    <div style="font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.06em;color:${ready};padding-bottom:7px;">${readiness}% READY</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.lilac};border-radius:2px;margin-bottom:11px;">
      <tr><td>
        <table role="presentation" width="${Math.max(2, readiness)}%" cellpadding="0" cellspacing="0" border="0" style="background:${ready};border-radius:2px;">
          <tr><td style="height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>
        </table>
      </td></tr>
    </table>
    <a href="${href}" style="font-family:${SERIF};font-size:16px;font-weight:700;color:${C.ink};text-decoration:none;">${esc(title)}</a>
    <div style="font-family:${SANS};font-size:13px;color:${C.sand};padding-top:3px;line-height:1.45;">${esc(description)}</div>
  </td></tr>
</table>`
}

// A quiet aside for the learning-science notes.
export function callout({ title, body }) {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px;background:${C.signalLight};border-radius:12px;">
  <tr><td style="padding:18px 20px;">
    <div style="font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${C.signal};padding-bottom:8px;">${title}</div>
    <div style="font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink};">${body}</div>
  </td></tr>
</table>`
}

export function emailShell({ preheader, body, unsubscribeUrl }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:${C.cream};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${C.cream};">${esc(preheader)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cream};">
<tr><td align="center" style="padding:32px 16px;">

  <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">

    <tr><td style="padding:0 4px 18px;">
      <a href="${SITE}" style="font-family:${SERIF};font-size:20px;font-weight:700;color:${C.ink};text-decoration:none;">comprendo<span style="color:${C.synapse};">.</span></a>
    </td></tr>

    <tr><td style="background:${C.paper};border-radius:14px;padding:34px 32px;">
      ${body}
    </td></tr>

    <tr><td style="padding:22px 8px 0;text-align:center;">
      <p style="margin:0 0 8px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.sand};">
        Learn the right words, in the right order.
      </p>
      <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.sand};">
        <a href="${unsubscribeUrl}" style="color:${C.sand};text-decoration:underline;">Unsubscribe</a>
        &nbsp;·&nbsp; Built in Barcelona
      </p>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`
}
