export const YANDEX_METRIKA_COUNTER_ID = process.env.NEXT_PUBLIC_YM_COUNTER_ID;

declare global {
  interface Window {
    ym?: (counterId: number, action: string, goal: string, params?: unknown) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!YANDEX_METRIKA_COUNTER_ID) return;

  window.ym?.(Number(YANDEX_METRIKA_COUNTER_ID), "reachGoal", name, params);
}
