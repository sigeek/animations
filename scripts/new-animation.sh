#!/usr/bin/env bash
# Start a new animation: Remotion project + skills + spec templates + the
# shared kit (copied from clawd-berlin, the reference implementation).
#
# Usage (from anywhere):  scripts/new-animation.sh <folder> <CompositionId> [--no-clawd]
#   e.g.                  scripts/new-animation.sh clawd-paris ClawdParis
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd)

name=${1:?folder name, e.g. clawd-paris}
comp=${2:?composition id, e.g. ClawdParis}
clawd=1
[ "${3:-}" = "--no-clawd" ] && clawd=0

command -v node >/dev/null || { echo "Node.js is missing. Install it with: brew install node (see PLAYBOOK.md, Setup)." >&2; exit 1; }
node -e "fetch('https://registry.npmjs.org').then(()=>process.exit(0)).catch(()=>process.exit(1))" \
  || { echo "Node can't reach npm over TLS. See PLAYBOOK.md, Setup (brew postinstall openssl@4)." >&2; exit 1; }
[ -e "$name" ] && { echo "$name already exists." >&2; exit 1; }

echo ">> Remotion blank project"
npx --yes create-video@latest --yes --blank "$name"
rm -rf "$name/.git" "$name/src/Composition.tsx"

echo ">> Remotion agent skills and fonts"
(cd "$name" && npx --yes skills add remotion-dev/skills --skill '*' --agent claude-code --copy -y >/dev/null)
(cd "$name" && npx remotion add @remotion/google-fonts >/dev/null)

echo ">> Kit"
K=clawd-berlin/src
T=templates/kit
mkdir -p "$name/src/components/street" "$name/reference"
cp "$K/motion.ts" "$K/shading.tsx" "$K/fonts.ts" "$name/src/"
cp "$K/components/Push.tsx" "$K/components/DebugOverlay.tsx" "$K/components/LineBadge.tsx" "$name/src/components/"
cp "$K/components/street/repeat.ts" "$name/src/components/street/"
cp "$T/tokens.ts" "$T/Root.tsx" "$T/Main.tsx" "$name/src/"
if [ "$clawd" = 1 ]; then
  cp "$K/components/Clawd.tsx" "$K/components/walkCycle.ts" "$K/components/hop.ts" "$name/src/components/"
  cp "$K/ClawdPoses.tsx" "$name/src/"
  cp clawd-berlin/reference/clawd.png "$name/reference/"
else
  sed -i '' '/clawd-only/d' "$name/src/Root.tsx" "$name/src/Main.tsx"
fi
sed -i '' "s/__COMP__/$comp/g" "$name/src/tokens.ts" "$name/src/Root.tsx"

echo ">> Spec templates"
cp templates/PROMPT.md templates/CLAUDE.md "$name/"
sed -i '' "s/<CompositionId>/$comp/g; s/<name>/$name/g" "$name/PROMPT.md"

echo ">> Format and check"
(cd "$name" && npx prettier --write src >/dev/null && npm run lint)

cat <<MSG

Done: $ROOT/$name
Next:
  1. Fill in $name/PROMPT.md (see PLAYBOOK.md, "Write the spec").
  2. Put references in $name/reference/.
  3. cd $name && npm run dev    # Studio at localhost:3000
  4. Add a row for $name to README.md.
MSG
