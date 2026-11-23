#!/bin/sh
# Builds a paid reader pack (PDF + one MP3 per story) and its free story-1 sample.
# Usage: PATH="/opt/homebrew/bin:$PATH" sh scripts/readers/build-pack.sh [level] [sample-slug]
#   level 1 → sample public/readers/la-carta-de-papa.{pdf,mp3}
#   level 2 → sample public/readers/<sample-slug>.{pdf,mp3}
set -e
LEVEL=${1:-1}
SAMPLE=${2:-la-carta-de-papa}
SRC=readers/level$LEVEL
OUT=readers/out
NAME="Diez historias - Level $LEVEL"
ZIP="spanish-short-stories-level-$LEVEL.zip"
rm -rf "$OUT/$NAME" "$OUT/$ZIP"
mkdir -p "$OUT/$NAME" public/readers
node scripts/readers/pack.mjs "$SRC" --out "$OUT/$NAME/$NAME.pdf"
node scripts/readers/pack.mjs "$SRC" --single "level$LEVEL-story01" --out "public/readers/$SAMPLE.pdf"
cp "$SRC/level$LEVEL-story01_javier.mp3" "public/readers/$SAMPLE.mp3"
node -e '
const fs = require("fs")
const files = fs.readdirSync(process.argv[1]).filter((f) => /^level\d+-story\d+\.json$/.test(f)).sort()
files.forEach((f, i) => {
  const s = JSON.parse(fs.readFileSync(`${process.argv[1]}/${f}`, "utf8"))
  fs.copyFileSync(`${process.argv[1]}/${s.id}_javier.mp3`, `${process.argv[2]}/${String(i + 1).padStart(2, "0")} - ${s.title.normalize("NFD").replace(/[̀-ͯ]/g, "")}.mp3`)
})' "$SRC" "$OUT/$NAME"
(cd "$OUT" && zip -0 -qr "$ZIP" "$NAME")
ls -la "$OUT/$ZIP"
