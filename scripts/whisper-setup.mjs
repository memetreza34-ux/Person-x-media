import path from "path";
import { downloadWhisperModel, installWhisperCpp } from "@remotion/install-whisper-cpp";

export const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
export const WHISPER_VERSION = "1.7.6";
export const WHISPER_MODEL = "large-v3-turbo";

if (import.meta.url === `file://${process.argv[1]}`) {
  await installWhisperCpp({ to: WHISPER_PATH, version: WHISPER_VERSION });
  await downloadWhisperModel({ model: WHISPER_MODEL, folder: WHISPER_PATH });
  console.log("Whisper bereit:", WHISPER_PATH);
}
