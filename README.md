# Animations

Code-rendered animations built with Claude Code and Remotion. See [GUIDE.md](GUIDE.md) for the workflow.

| Folder | Description | Length |
|---|---|---|
| [clawd-berlin](clawd-berlin/) | Clawd (the pixel Claude mascot) tours Berlin by S3, U5, bus 100 and bike | 30 s, 1080x1080, 30 fps |

## Run

```bash
cd clawd-berlin && npm install && npm run dev
```

Final render (debug overlay off):

```bash
npx remotion render ClawdBerlin out/clawd-berlin.mp4
```
