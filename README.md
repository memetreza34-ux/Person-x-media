# Person-x-media

Erklär-Kanal mit fester Hauptfigur. Videos werden mit Remotion als Code gebaut (Hochformat 1080×1920).

## Start

```bash
npm i
npm run dev
```

Studio öffnet sich auf `http://localhost:3000`.

## Rendern

```bash
npx remotion render Showcase out/showcase.mp4
```

## Installierte Tools

| Paket | Wofür |
| --- | --- |
| `@remotion/transitions` | Szenenwechsel (slide, fade, wipe, flip) |
| `@remotion/shapes` | Kreise, Sterne, Pfeile, Polygone |
| `@remotion/paths` | Linien live zeichnen (Whiteboard) |
| `@remotion/noise` | Organische Bewegung, Partikel |
| `@remotion/motion-blur` | Bewegungsunschärfe |
| `@remotion/google-fonts` | Schriften |
| `@remotion/media`, `@remotion/media-utils` | Video, Audio, Audio-Visualisierung |
| `@remotion/sfx` | Soundeffekte |
| `@remotion/captions` | Untertitel im TikTok-Stil |
| `@remotion/lottie` + `lottie-web` | Fertige Lottie-Animationen |
| `@remotion/layout-utils` | Text automatisch einpassen |
| `@remotion/animation-utils` | CSS-Transforms kombinieren |
| `@remotion/three` + `three`, `@react-three/fiber`, `@react-three/drei` | 3D-Szenen |

Außerdem: `ffmpeg` und Manim (für Mathe-/Technik-Animationen) systemweit.

## Untertitel mit Whisper

Einmalig Whisper.cpp und das Modell `large-v3-turbo` laden (~1,6 GB, landet in `whisper.cpp/`):

```bash
npm run whisper:setup
```

Danach eine Sprachaufnahme transkribieren (Deutsch, Wort-Timing):

```bash
npm run transcribe -- public/stimme.mp3
```

Ergebnis: `public/stimme.json` mit Captions für `@remotion/captions`.

## Struktur

Siehe [CLAUDE.md](CLAUDE.md). Kurz:

- `src/characters/` – Max (2D) und Bewegungs-Helfer
- `src/world2d/` – Stadt mit Orten und Tag/Nacht
- `src/ui/` – Einblendungen (Uhr, Stempel, Infokarte, Untertitel …)
- `src/episodes/` – Folgen
- `src/experiments/` – alte 3D-Versuche
- `.claude/skills/` – Remotion-Skills (offiziell, v4.0.539) und Projekt-Skill `neue-folge`
