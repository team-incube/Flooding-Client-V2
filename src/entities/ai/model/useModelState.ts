"use client";

import { useSyncExternalStore } from "react";
import {
  getModelStateSnapshot,
  subscribeModelState,
  type ModelState,
} from "@/entities/ai/lib/webllmEngine";

export function useModelState(): ModelState {
  return useSyncExternalStore(
    subscribeModelState,
    getModelStateSnapshot,
    getModelStateSnapshot,
  );
}
