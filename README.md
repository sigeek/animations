# Animations

Code-rendered animations built with Claude Code and Remotion.

| Folder | Description | Length |
|---|---|---|
| [clawd-berlin](clawd-berlin/) | Clawd (the pixel Claude mascot) spends a day touring Berlin by S3, U5, bus 100 and bike, from morning at Alexanderplatz to sunset on Tempelhofer Feld | 30 s, 1080x1080, 30 fps |
| [pomelo-marcello](pomelo-marcello/) | Marcello, who runs a café in Milan, lets his AI intern ([Pomelo](https://pomelo-weld.vercel.app)) turn a 1-star review into a reply that sounds like him; real app screens, voiceover | 10 s, 1080x1920, 30 fps |
| [pomelo-cocina](pomelo-cocina/) | Marcello trains Pip, his AI apprentice in Pomelo, on real Kiez Café jobs: staff rota, then an Instagram caption; Paper design screens, voiceover | 2 min, 1080x1920, 30 fps |

## Start a new one

```bash
scripts/new-animation.sh <folder> <CompositionId>
```

Then fill in `<folder>/PROMPT.md`. The full workflow is in [PLAYBOOK.md](PLAYBOOK.md); Claude's house rules are in [CLAUDE.md](CLAUDE.md).

## Run an existing one

```bash
cd clawd-berlin && npm install && npm run dev
```

Final render (debug overlay off):

```bash
cd clawd-berlin && npx remotion render ClawdBerlin out/clawd-berlin.mp4 --props='{"debug":false}'
```
