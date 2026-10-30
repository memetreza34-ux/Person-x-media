// Nutzung: npm run transcribe -- public/stimme.mp3
// Schreibt public/stimme.json mit Captions (Wort-Timing) für @remotion/captions.
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from "./whisper-setup.mjs";

const input = process.argv[2];
if (!input) {
  console.error("Bitte Audiodatei angeben: npm run transcribe -- public/stimme.mp3");
  process.exit(1);
}

const wav = path.join(WHISPER_PATH, "tmp-16k.wav");
execFileSync("npx", ["remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", input, "-ar", "16000", "-ac", "1", wav]);

const output = await transcribe({
  inputPath: wav,
  whisperPath: WHISPER_PATH,
  whisperCppVersion: WHISPER_VERSION,
  model: WHISPER_MODEL,
  language: "de",
  tokenLevelTimestamps: true,
});
fs.rmSync(wav);

// Whisper liefert Wortteile ("l", "ü", "gt"); nur Tokens mit führendem Leerzeichen beginnen ein neues Wort.
const captions = [];
for (const token of toCaptions({ whisperCppOutput: output }).captions) {
  const prev = captions[captions.length - 1];
  if (prev && !token.text.startsWith(" ")) {
    prev.text += token.text;
    prev.endMs = token.endMs;
  } else {
    captions.push({ ...token });
  }
}
const out = input.replace(/\.[^.]+$/, ".json");
fs.writeFileSync(out, JSON.stringify(captions, null, 2));
console.log(`${captions.length} Wörter → ${out}`);
