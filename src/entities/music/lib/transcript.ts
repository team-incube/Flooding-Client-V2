import { execFile } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface YoutubeTranscriptSuccess {
  text: string;
}

export interface YoutubeTranscriptFailure {
  error: string;
}

export type YoutubeTranscriptResult =
  | YoutubeTranscriptSuccess
  | YoutubeTranscriptFailure;

const PREFERRED_LANGS = ["ko", "en"];
const YT_DLP_CONCURRENCY = Number(process.env.YT_DLP_CONCURRENCY ?? 20);
const YT_DLP_BIN = process.env.YT_DLP_PATH ?? "yt-dlp";
const YT_DLP_TIMEOUT_MS = 60_000;

const transcriptCache = new Map<string, string>();

let activeYtDlp = 0;
const ytDlpWaiters: Array<() => void> = [];

async function withYtDlpLimit<T>(task: () => Promise<T>): Promise<T> {
  if (activeYtDlp >= YT_DLP_CONCURRENCY) {
    await new Promise<void>((resolve) => ytDlpWaiters.push(resolve));
  }
  activeYtDlp += 1;
  try {
    return await task();
  } finally {
    activeYtDlp -= 1;
    ytDlpWaiters.shift()?.();
  }
}

function toTimestamp(h: number, m: number, s: number): string {
  const total = h * 3600 + m * 60 + s;
  const sec = String(total % 60).padStart(2, "0");
  const min = Math.floor(total / 60) % 60;
  const hr = Math.floor(total / 3600);
  return hr > 0
    ? `${hr}:${String(min).padStart(2, "0")}:${sec}`
    : `${min}:${sec}`;
}

function cleanVtt(vtt: string): string {
  const entries: string[] = [];
  let time = "0:00";
  let previous: string | null = null;

  for (const rawLine of vtt.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (
      !line ||
      line.startsWith("WEBVTT") ||
      line.startsWith("Kind:") ||
      line.startsWith("Language:") ||
      /^\d+$/.test(line)
    ) {
      continue;
    }

    const cue = line.match(/^(\d{2}):(\d{2}):(\d{2})[.,]\d+\s*-->/);
    if (cue) {
      time = toTimestamp(Number(cue[1]), Number(cue[2]), Number(cue[3]));
      continue;
    }

    const text = line.replace(/<[^>]+>/g, "").trim();
    if (!text || text === previous) continue;
    entries.push(`[${time}] ${text}`);
    previous = text;
  }

  return entries.join("\n");
}

function langOf(fileName: string): string {
  return fileName.split(".").at(-2) ?? "";
}

async function extractViaYtDlp(
  videoId: string,
): Promise<YoutubeTranscriptResult> {
  let workDir: string | null = null;
  try {
    workDir = await mkdtemp(path.join(tmpdir(), "yt-transcript-"));

    const args = [
      "--skip-download",
      "--write-sub",
      "--write-auto-sub",
      "--sub-lang",
      PREFERRED_LANGS.join(","),
      "--sub-format",
      "vtt",
      "--retries",
      "3",
      "--retry-sleep",
      "5",
      "--ignore-errors",
      "--no-abort-on-error",
      "--sleep-subtitles",
      "1",
      "--no-warnings",
      "-o",
      path.join(workDir, `${videoId}.%(ext)s`),
      `https://www.youtube.com/watch?v=${videoId}`,
    ];

    let rawStderr = "";
    try {
      const { stderr } = await execFileAsync(YT_DLP_BIN, args, {
        timeout: YT_DLP_TIMEOUT_MS,
      });
      rawStderr = stderr ?? "";
    } catch (execError) {
      const err = execError as { stderr?: string; message?: string };
      rawStderr = err.stderr ?? err.message ?? String(execError);
    }

    const files = (await readdir(workDir)).filter((f) => f.endsWith(".vtt"));
    if (files.length === 0) {
      return { error: rawStderr.trim() || "자막 파일 없음(원인 미상)" };
    }

    const preferredFile =
      PREFERRED_LANGS.map((code) => files.find((f) => langOf(f) === code)).find(
        Boolean,
      ) ?? files[0];

    const text = cleanVtt(
      await readFile(path.join(workDir, preferredFile), "utf-8"),
    );
    if (!text) return { error: "yt-dlp: 자막 텍스트가 비어 있습니다." };

    return { text };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  } finally {
    if (workDir) {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

export async function getYoutubeTranscript(
  videoId: string,
): Promise<YoutubeTranscriptResult> {
  const cached = transcriptCache.get(videoId);
  if (cached) return { text: cached };

  const result = await withYtDlpLimit(() => extractViaYtDlp(videoId));
  if (!("error" in result)) transcriptCache.set(videoId, result.text);
  return result;
}
