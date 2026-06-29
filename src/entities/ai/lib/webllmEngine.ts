import type { InitProgressReport, WebWorkerMLCEngine } from "@mlc-ai/web-llm";

export const MUSIC_LLM_MODEL_ID = "gemma-2-2b-it-q4f16_1-MLC";

let enginePromise: Promise<WebWorkerMLCEngine> | null = null;

export function getMusicLlmEngine(
  onProgress?: (report: InitProgressReport) => void,
): Promise<WebWorkerMLCEngine> {
  if (!enginePromise) {
    enginePromise = (async () => {
      const { CreateWebWorkerMLCEngine } = await import("@mlc-ai/web-llm");
      const worker = new Worker(
        new URL("./webllm.worker.ts", import.meta.url),
        { type: "module" },
      );

      return CreateWebWorkerMLCEngine(worker, MUSIC_LLM_MODEL_ID, {
        initProgressCallback: onProgress,
      });
    })().catch((error) => {
      enginePromise = null;
      throw error;
    });
  }

  return enginePromise;
}
