---
name: neue-folge
description: Baut eine neue Folge für den Person-x-media-Kanal mit Max (2D-Vektor, Remotion, 1080×1920). Nutzen bei "neue Folge", "Folge über …", "Video über …", "Episode bauen".
---

# Neue Folge bauen

Lade zuerst `remotion-best-practices` und daraus `remotion-markup` (Timing, Multi-Scene, Voiceover, SFX).

## Ablauf

1. **Thema + Recherche.** Fakten mit Quellen sammeln, in `docs/folgen/<slug>.md` festhalten. Zahlen ohne Quelle nur als "Beispielrechnung" kennzeichnen.
2. **Skript.** 30–75 s. Aufbau:
   - Hook (0–2 s): Frage oder krasse Aussage, Titel-Einblendung
   - 3–5 Szenen, jede mit einem Ort aus `PLACES` und einer Einblendung aus `Overlays`
   - Wendung/Fakt mit Stempel
   - Abschluss-Frage an die Zuschauer (Kommentare)
3. **Ordner** `src/episodes/<slug>/` mit einer Datei pro Szene, zusammengesetzt mit `<TransitionSeries>` (siehe `multi-scene-video.md`). Szenen zusätzlich als eigene Composition in einem `<Folder>` registrieren.
4. **Stimme.** Voiceover pro Szene erzeugen (`voiceover.md`), dann `npm run transcribe` für Wort-Zeiten → Untertitel und Mundbewegung daraus, nicht schätzen. Szenenlänge per `calculateMetadata` aus der Audiolänge.
5. **Sound.** SFX bei jedem Ereignis: Pop (Tag/Karte), Stempel (Schlag), Poof (Whoosh), Szenenwechsel (Whoosh). Leise Musik unter der Stimme.
6. **Prüfen.** Pro Szene ein Standbild rendern und ansehen, dann komplett rendern.

## Qualitäts-Checkliste (vor jedem Render)

- [ ] Max sieht in jeder Szene gleich aus (nur `Max2D`, Kostüme aus `COSTUMES`)
- [ ] Nichts überlappt Max' Gesicht, Uhr oder Untertitel
- [ ] Jede Bewegung hat Easing (`Easing.bezier(0.16, 1, 0.3, 1)` oder Spring), nichts linear außer Laufen
- [ ] Max bewegt sich nie komplett still: Blinzeln, Atmen/Idle, Mund nur beim Sprechen
- [ ] Untertitel max. 3 Wörter, nie über Satzgrenzen
- [ ] Jede Einblendung hat einen Sound
- [ ] Szenenwechsel mit Transition, kein harter Schnitt ohne Grund
- [ ] Text gut lesbar auf dem Handy (min. 44 px)
- [ ] Quellen in der Beschreibung, Beispielwerte gekennzeichnet

## Bausteine

- Figur: `Max2D` – Props `costume`, `expression`, `prop`, `mouthOpen`, `blink`, `walkPhase/walkAmount`, `wave`, `point`, `squash`
- Welt: `Town` – Props `camX`, `camY`, `zoom`, `hour`; Orte über `PLACES`, Max steht auf `WALK_Y`
- Einblendungen: `ClockBadge`, `Tag`, `Stamp`, `InfoCard`, `Inset`, `Captions`, `SeriesTitle`, `Poof`
- Bewegung: `blinkAt`, `talkAt`, `headIdle` aus `characters/maxMotion.ts`

Fehlt ein Ort, eine Pose oder eine Einblendung: erst den Baustein sauber bauen und im Charakterblatt bzw. einer Test-Composition prüfen, dann in der Folge nutzen.
