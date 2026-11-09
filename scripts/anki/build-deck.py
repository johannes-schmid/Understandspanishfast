# Builds the Top 1,500 Spanish Anki deck (.apkg) from data/words.json.
# Setup once: python3 -m venv scripts/anki/.venv && scripts/anki/.venv/bin/pip install genanki
# Run:        scripts/anki/.venv/bin/python scripts/anki/build-deck.py [--limit 100 --out path.apkg]
import argparse
import html
import json
import os
import subprocess

import genanki

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
WORDS = os.path.join(ROOT, 'data', 'words.json')
AUDIO = os.path.join(ROOT, 'public', 'audio')
IMAGES = os.path.join(ROOT, 'public', 'word-images')
CACHE = os.path.join(ROOT, 'workbook', 'build', 'anki-img')

MODEL_ID = 1730214001
DECK_ID = 1730214002
SAMPLE_DECK_ID = 1730214003

POS = {'v.': 'verb', 'n.m.': 'noun, masculine', 'n.f.': 'noun, feminine', 'n.': 'noun', 'adj.': 'adjective',
       'adv.': 'adverb', 'pron.': 'pronoun', 'prep.': 'preposition', 'conj.': 'conjunction', 'det.': 'determiner',
       'num.': 'number', 'intj.': 'interjection', 'expr.': 'phrase', 'propn.': 'name'}
EL_FEM = {'agua', 'alma', 'área', 'arma', 'hambre', 'águila', 'hacha', 'aula', 'ala', 'ama', 'arte'}
POINTS = [(0, 0), (100, 50), (250, 60), (500, 67), (750, 72), (1000, 74), (1500, 80), (2000, 84), (3000, 90)]


def coverage(n):
    for (x0, y0), (x1, y1) in zip(POINTS, POINTS[1:]):
        if n <= x1:
            return round(y0 + (n - x0) / (x1 - x0) * (y1 - y0))
    return 90


def coverage_line(rank):
    if rank <= 100:
        return 'Top 100 word: the first 100 cover about half of everyday Spanish'
    return f'Knowing the top {rank:,} words covers about {coverage(rank)}% of everyday Spanish'


def esc(s):
    return html.escape(s, quote=False)


def display(w):
    word = w['word']
    if w['pos'] in ('n.m.', 'n.f.'):
        for art in ('un ', 'una ', 'el ', 'la '):
            if word.startswith(art):
                word = word[len(art):]
                break
        art = 'el' if w['pos'] == 'n.m.' or word in EL_FEM else 'la'
        return f'<span class="art">{art}</span> {esc(word)}'
    return esc(word)


def small_image(name):
    os.makedirs(CACHE, exist_ok=True)
    out = os.path.join(CACHE, name)
    if not os.path.exists(out):
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '70', '--resampleWidth', '480',
                        os.path.join(IMAGES, name), '--out', out], check=True, capture_output=True)
    return out


CSS = """
.card{font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:18px;line-height:1.5;color:#14204a;background:#fcfcff;text-align:center;padding:24px 16px}
.nightMode.card,.night_mode .card{color:#e8eaf6;background:#151a2e}
.rank{display:inline-block;font:600 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.06em;color:#b23d12;background:#fde9e0;padding:6px 10px;border-radius:999px}
.nightMode .rank,.night_mode .rank{color:#ffb79b;background:#3a2220}
.word{font-size:44px;font-weight:700;letter-spacing:-.02em;margin:18px 0 6px}
.art{font-weight:500;color:#6b7194}
.prompt{font-size:30px;font-weight:700;margin:18px 0 6px}
.pos{font-size:14px;color:#6b7194}
.hint{font-size:13px;color:#6b7194;margin-top:14px}
hr#answer{border:0;border-top:1px solid #dfe2f3;margin:22px auto;max-width:420px}
.meaning{font-size:24px;font-weight:600}
.pic img{max-width:260px;width:100%;border-radius:14px;margin:16px 0 4px}
.ex{max-width:460px;margin:18px auto 0;padding:16px 18px;border-radius:14px;background:#eef0fb;text-align:left}
.nightMode .ex,.night_mode .ex{background:#222842}
.ex-es{font-size:18px;font-weight:600}
.ex-en{font-size:15px;color:#6b7194;margin-top:4px}
.cov{font-size:12px;color:#6b7194;margin-top:18px}
"""

FRONT_ES = '<div class="rank">#{{Rank}}</div><div class="word">{{Word}}</div>{{WordAudio}}'
BACK_ES = """{{FrontSide}}<hr id=answer>
<div class="meaning">{{Meaning}}</div><div class="pos">{{Type}}</div>
{{#Image}}<div class="pic">{{Image}}</div>{{/Image}}
<div class="ex"><div class="ex-es">{{Example}} {{SentenceAudio}}</div><div class="ex-en">{{Translation}}</div></div>
<div class="cov">{{Coverage}}</div>"""
FRONT_EN = '<div class="rank">#{{Rank}}</div><div class="prompt">{{Meaning}}</div><div class="pos">{{Type}}</div><div class="hint">Say it in Spanish</div>'
BACK_EN = """{{FrontSide}}<hr id=answer>
<div class="word">{{Word}}</div>{{WordAudio}}
<div class="ex"><div class="ex-es">{{Example}} {{SentenceAudio}}</div><div class="ex-en">{{Translation}}</div></div>"""

MODEL = genanki.Model(
    MODEL_ID, 'Most Common Spanish (Top 1,500)',
    fields=[{'name': n} for n in ['Rank', 'Word', 'Meaning', 'Type', 'Example', 'Translation', 'WordAudio',
                                  'SentenceAudio', 'Image', 'Coverage']],
    templates=[
        {'name': 'Spanish to English', 'qfmt': FRONT_ES, 'afmt': BACK_ES},
        {'name': 'English to Spanish', 'qfmt': FRONT_EN, 'afmt': BACK_EN},
    ],
    css=CSS,
    sort_field_index=0,
)


class WordNote(genanki.Note):
    @property
    def guid(self):
        return genanki.guid_for('mcs-top1500', self.fields[0])


def build(limit, out):
    words = json.load(open(WORDS, encoding='utf-8'))[:limit]
    full = limit >= 1500
    name = 'Top 1,500 Spanish Words (Most Common Spanish)' if full else f'Top {limit} Spanish Words (free sample)'
    desc = ('The 1,500 most frequent Spanish words in frequency order, with native audio, example sentences '
            'and pictures. New cards come in rank order: word #1 first. mostcommonspanish.com')
    deck = genanki.Deck(DECK_ID if full else SAMPLE_DECK_ID, name, description=desc)
    media = []
    for w in words:
        rank = w['rank']
        img = ''
        if w.get('image'):
            path = small_image(w['image'])
            media.append(path)
            img = f'<img src="{os.path.basename(path)}" alt="">'
        for key in ('audio', 'sentence_audio'):
            media.append(os.path.join(AUDIO, w[key]))
        unit = (rank - 1) // 50 + 1
        tags = [f'unit::{unit:02d}', f'top::{((rank - 1) // 100 + 1) * 100}', POS.get(w['pos'], 'other').split(',')[0]]
        note = WordNote(
            model=MODEL,
            fields=[
                str(rank), display(w), esc(' · '.join(w['meanings'][:2])), POS.get(w['pos'], w['pos']),
                esc(w['example_es']), esc(w['example_en']),
                f'[sound:{w["audio"]}]', f'[sound:{w["sentence_audio"]}]', img,
                coverage_line(rank),
            ],
            tags=tags,
            due=rank,
        )
        deck.add_note(note)
    pkg = genanki.Package(deck)
    pkg.media_files = media
    os.makedirs(os.path.dirname(out), exist_ok=True)
    pkg.write_to_file(out)
    print(f'{out}: {len(words)} notes, {len(media)} media files, {os.path.getsize(out) / 1e6:.1f} MB')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=1500)
    ap.add_argument('--out', default=os.path.join(ROOT, 'workbook', 'out', 'top-1500-spanish-words.apkg'))
    a = ap.parse_args()
    build(a.limit, a.out)
