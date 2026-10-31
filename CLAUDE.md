# Person-x-media

Erklär-Kanal (TikTok/Reels/Shorts, 1080×1920) mit fester Hauptfigur **Max**. Alles wird in Remotion als 2D-Vektor gebaut – keine KI-Bilder, keine fremden Assets.

## Regeln

- Antworten an Arman auf Deutsch, kurz.
- Vor Arbeit an Videos: Skill `remotion-best-practices` (Projekt-Version unter `.claude/skills/`) und für neue Folgen Skill `neue-folge` laden.
- Kein 1:1-Nachbau fremder Kanäle (z. B. „Theo ist heute …“). Eigenes Format, eigener Look, höhere Qualität.
- Fakten in Folgen müssen recherchiert und belegbar sein; Beispielrechnungen klar kennzeichnen.

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `src/design/theme.ts` | Farben, Linie (`INK`, `LINE`), Schrift Fredoka |
| `src/characters/Max2D.tsx` | Max: Kostüme, Ausdrücke, Requisiten, Laufen/Winken/Zeigen/Sprechen |
| `src/characters/maxMotion.ts` | Blinzeln, Sprechen, Kopf-Idle |
| `src/world2d/Town.tsx` | Stadt mit Orten (`PLACES`), Himmel nach Uhrzeit, Parallax |
| `src/ui/Overlays.tsx` | Uhr, Tag, Stempel, Infokarte, Kreis-Einblendung, Untertitel, Titel, Poof |
| `src/episodes/` | Folgen und Charakterblatt |
| `src/experiments/` | Alte 3D-/Test-Versuche, nicht weiterentwickeln |
| `scripts/` | Whisper-Setup und Transkription |
| `docs/` | Recherche und Analysen |

## Befehle

```bash
npm run dev                                        # Studio
npx remotion still <id> out/x.png --frame=<n>      # Einzelbild prüfen
npx remotion render <id> out/<name>.mp4            # Video rendern
npm run transcribe -- public/<datei>               # Wort-Zeiten per Whisper
```

3D-Experimente brauchen `--gl=angle`.
