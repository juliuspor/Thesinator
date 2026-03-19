import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useDelayedPending } from "@/hooks/use-delayed-pending";

afterEach(() => {
  vi.useRealTimers();
});

describe("useDelayedPending", () => {
  it("does not show pending before delayMs", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ pending }) => useDelayedPending(pending, { delayMs: 120, minDurationMs: 500 }),
      { initialProps: { pending: false } },
    );

    expect(result.current).toBe(false);

    rerender({ pending: true });

    act(() => {
      vi.advanceTimersByTime(119);
    });

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe(true);
  });

  it("keeps pending visible for at least minDurationMs once shown", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ pending }) => useDelayedPending(pending, { delayMs: 120, minDurationMs: 500 }),
      { initialProps: { pending: false } },
    );

    rerender({ pending: true });

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(result.current).toBe(true);

    rerender({ pending: false });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe(false);
  });

  it("does not flicker on rapid true -> false -> true transitions", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ pending }) => useDelayedPending(pending, { delayMs: 120, minDurationMs: 500 }),
      { initialProps: { pending: false } },
    );

    rerender({ pending: true });

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(result.current).toBe(true);

    rerender({ pending: false });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(true);

    rerender({ pending: true });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);

    rerender({ pending: false });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(false);
  });
});
