#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXT_DIR="$ROOT_DIR/extension"
DIST_DIR="$ROOT_DIR/dist"
VERSION="$(python3 - "$EXT_DIR/manifest.json" <<'PY'
import json
import sys
from pathlib import Path
manifest = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
print(manifest.get('version', 'dev'))
PY
)"

mkdir -p "$DIST_DIR"
OUT="$DIST_DIR/auto-responder-shopee-v${VERSION}.zip"
rm -f "$OUT"

cd "$EXT_DIR"
zip -qr "$OUT" .

echo "Pacote gerado: $OUT"
