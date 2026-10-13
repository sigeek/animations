# Animations

Code-rendered animations built with Claude Code and Remotion. See [GUIDE.md](GUIDE.md) for the workflow.

| Folder | Description | Length |
|---|---|---|
| [claw-berlin](claw-berlin/) | Claw (the pixel Claude mascot) tours Berlin by S3, U5, bus 100 and bike | 30 s, 1080x1080, 30 fps |

## Run

```bash
cd claw-berlin && npm install && npm run dev
```

Final render (debug overlay off):

```bash
npx remotion render ClawBerlin out/claw-berlin.mp4
```
