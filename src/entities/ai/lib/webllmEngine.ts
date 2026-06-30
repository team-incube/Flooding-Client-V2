import type { WebWorkerMLCEngine } from "@mlc-ai/web-llm";

export const MUSIC_LLM_MODEL_ID = "gemma-2-2b-it-q4f16_1-MLC";

export type ModelState =
  | { status: "idle" }
  | { status: "loading"; progress: number }
  | { status: "ready" }
  | { status: "error"; message: string };

const WEBGPU_UNSUPPORTED_MESSAGE =
  "이 브라우저/기기에서 WebGPU를 사용할 수 없습니다.";

let enginePromise: Promise<WebWorkerMLCEngine> | null = null;
let modelState: ModelState = { status: "idle" };
const listeners = new Set<() => void>();

function setModelState(next: ModelState) {
  modelState = next;
  listeners.forEach((listener) => listener());
}

export function subscribeModelState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getModelStateSnapshot(): ModelState {
  return modelState;
}

export async function ensureWebGpuSupport(): Promise<void> {
  if (modelState.status !== "idle") return;

  const gpu = (
    navigator as Navigator & {
      gpu?: { requestAdapter: () => Promise<unknown> };
    }
  ).gpu;

  if (!gpu) {
    setModelState({ status: "error", message: WEBGPU_UNSUPPORTED_MESSAGE });
    return;
  }

  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) {
      setModelState({ status: "error", message: WEBGPU_UNSUPPORTED_MESSAGE });
    }
  } catch {
    setModelState({ status: "error", message: WEBGPU_UNSUPPORTED_MESSAGE });
  }
}

export function getMusicLlmEngine(): Promise<WebWorkerMLCEngine> {
  if (!enginePromise) {
    setModelState({ status: "loading", progress: 0 });
    enginePromise = (async () => {
      const { CreateWebWorkerMLCEngine } = await import("@mlc-ai/web-llm");
      const worker = new Worker(
        new URL("./webllm.worker.ts", import.meta.url),
        {
          type: "module",
        },
      );

      const engine = await CreateWebWorkerMLCEngine(
        worker,
        MUSIC_LLM_MODEL_ID,
        {
          initProgressCallback: (report) =>
            setModelState({ status: "loading", progress: report.progress }),
        },
      );
      setModelState({ status: "ready" });
      return engine;
    })().catch((error) => {
      enginePromise = null;
      const reason = error instanceof Error ? error.message : String(error);
      setModelState({
        status: "error",
        message: reason.includes("WebGPU")
          ? WEBGPU_UNSUPPORTED_MESSAGE
          : "AI 모델을 불러오지 못했습니다.",
      });
      throw error;
    });
  }

  return enginePromise;
}
