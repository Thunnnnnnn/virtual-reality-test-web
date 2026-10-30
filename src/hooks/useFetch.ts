"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Result<T> {
  tick: number;
  data: T | null;
  error: string | null;
}

export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result<T>>({
    tick: -1,
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    fetcher(controller.signal)
      .then((data) => setResult({ tick, data, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setResult({
          tick,
          data: null,
          error: err instanceof Error ? err.message : "Something went wrong",
        });
      });
    return () => controller.abort();
  }, [fetcher, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    data: result.data,
    error: result.error,
    loading: result.tick !== tick,
    refetch,
  };
}
