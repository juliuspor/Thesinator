import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StepGenieChat } from "@/components/ThesisFinder";
import {
  fetchThesinatorTopTopics,
  sendThesinatorTurn,
  startThesinatorSession,
} from "@/services/thesinator";

vi.mock("@/services/thesinator", async () => {
  const actual = await vi.importActual<typeof import("@/services/thesinator")>("@/services/thesinator");
  return {
    ...actual,
    startThesinatorSession: vi.fn(),
    sendThesinatorTurn: vi.fn(),
    fetchThesinatorTopTopics: vi.fn(),
  };
});

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const createDeferred = <T,>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const startThesinatorSessionMock = vi.mocked(startThesinatorSession);
const sendThesinatorTurnMock = vi.mocked(sendThesinatorTurn);
const fetchThesinatorTopTopicsMock = vi.mocked(fetchThesinatorTopTopics);

const baseStartResponse = {
  session_id: "session-1",
  client_token: "client-1",
  assistant_reply: "Let us find your direction.",
  audio_b64: null,
  questions: [
    {
      id: 1,
      question: "What role fits you best right now?",
      options: ["Option A", "Option B", "Option C", "Option D"],
    },
  ],
  question: {
    id: 1,
    question: "What role fits you best right now?",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
  question_index: 0,
  is_complete: false,
} as const;

beforeEach(() => {
  vi.useFakeTimers();
  fetchThesinatorTopTopicsMock.mockResolvedValue({
    top_topics: [],
    matching_meta: {
      used_vector: true,
      relaxation_stage: 0,
      total_candidates: 0,
    },
  });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("StepGenieChat waiting UX", () => {
  it("scrolls the waiting card into view when pending feedback appears", async () => {
    const turnDeferred = createDeferred<{
      session_id: string;
      client_token: string | null;
      assistant_reply: string;
      audio_b64: string | null;
      next_question: {
        id: number;
        question: string;
        options: string[];
      };
      question_index: number;
      is_complete: boolean;
    }>();
    const scrollIntoViewMock = vi.fn();
    const originalScrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollIntoView",
    );
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoViewMock,
    });

    try {
      startThesinatorSessionMock.mockResolvedValue(baseStartResponse);
      sendThesinatorTurnMock.mockReturnValue(turnDeferred.promise);

      render(<StepGenieChat onComplete={vi.fn()} />);

      await act(async () => {
        await Promise.resolve();
      });

      fireEvent.click(screen.getByRole("button", { name: "Option A" }));

      act(() => {
        vi.advanceTimersByTime(130);
      });

      expect(screen.getByTestId("step-genie-next-question-skeleton")).toBeInTheDocument();
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth", block: "nearest" });

      await act(async () => {
        turnDeferred.resolve({
          session_id: "session-1",
          client_token: "client-2",
          assistant_reply: "Nice, let us narrow it down.",
          audio_b64: null,
          next_question: {
            id: 2,
            question: "Which impact matters most to you?",
            options: ["Impact A", "Impact B", "Impact C", "Impact D"],
          },
          question_index: 1,
          is_complete: false,
        });
        await Promise.resolve();
      });
    } finally {
      if (originalScrollIntoViewDescriptor) {
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", originalScrollIntoViewDescriptor);
      } else {
        delete (HTMLElement.prototype as { scrollIntoView?: unknown }).scrollIntoView;
      }
    }
  });

  it("renders loading skeleton while session is bootstrapping", async () => {
    const startDeferred = createDeferred<typeof baseStartResponse>();
    startThesinatorSessionMock.mockReturnValue(startDeferred.promise);

    render(<StepGenieChat onComplete={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(130);
    });

    expect(screen.getByTestId("step-genie-chat-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("Thesinator is preparing the next step...")).not.toBeInTheDocument();

    await act(async () => {
      startDeferred.resolve(baseStartResponse);
      await Promise.resolve();
    });
  });

  it("keeps current turn visible while next turn loads and applies transition when next question arrives", async () => {
    const turnDeferred = createDeferred<{
      session_id: string;
      client_token: string | null;
      assistant_reply: string;
      audio_b64: string | null;
      next_question: {
        id: number;
        question: string;
        options: string[];
      };
      question_index: number;
      is_complete: boolean;
    }>();

    const scrollToMock = vi.fn();
    const originalScrollToDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollTo");
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollToMock,
    });

    try {
      startThesinatorSessionMock.mockResolvedValue(baseStartResponse);
      sendThesinatorTurnMock.mockReturnValue(turnDeferred.promise);

      render(<StepGenieChat onComplete={vi.fn()} />);

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByTestId("step-genie-chat-scroll-canvas")).toHaveClass("overflow-y-auto");
      expect(screen.getAllByText("What role fits you best right now?").length).toBeGreaterThan(0);
      scrollToMock.mockClear();

      fireEvent.click(screen.getByRole("button", { name: "Option A" }));

      expect(screen.getAllByText("What role fits you best right now?")).toHaveLength(1);

      const optionButtons = ["Option A", "Option B", "Option C", "Option D"].map((label) =>
        screen.getByRole("button", { name: label }),
      );
      optionButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });

      act(() => {
        vi.advanceTimersByTime(130);
      });

      expect(screen.getAllByText("What role fits you best right now?")).toHaveLength(1);
      expect(screen.getByTestId("step-genie-next-question-skeleton")).toBeInTheDocument();
      expect(screen.getByText("Got it. I locked in your answer.")).toBeInTheDocument();
      expect(screen.queryByText("Captured")).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1600);
      });

      expect(screen.queryByText("Got it. I locked in your answer.")).not.toBeInTheDocument();
      expect(screen.getByText(/previous choices|best next question/i)).toBeInTheDocument();

      await act(async () => {
        turnDeferred.resolve({
          session_id: "session-1",
          client_token: "client-2",
          assistant_reply: "Nice, let us narrow it down.",
          audio_b64: null,
          next_question: {
            id: 2,
            question: "Which impact matters most to you?",
            options: ["Impact A", "Impact B", "Impact C", "Impact D"],
          },
          question_index: 1,
          is_complete: false,
        });
        await Promise.resolve();
      });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(screen.getByText("Which impact matters most to you?")).toBeInTheDocument();
      expect(scrollToMock).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
      expect(screen.getByTestId("step-genie-active-turn")).toHaveAttribute("data-transitioning", "true");

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByTestId("step-genie-active-turn")).toHaveAttribute("data-transitioning", "false");

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByTestId("step-genie-next-question-skeleton")).not.toBeInTheDocument();
    } finally {
      if (originalScrollToDescriptor) {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", originalScrollToDescriptor);
      } else {
        delete (HTMLElement.prototype as { scrollTo?: unknown }).scrollTo;
      }
    }
  });

  it("shows long-wait reassurance when the API call takes longer", async () => {
    const turnDeferred = createDeferred<{
      session_id: string;
      client_token: string | null;
      assistant_reply: string;
      audio_b64: string | null;
      next_question: {
        id: number;
        question: string;
        options: string[];
      };
      question_index: number;
      is_complete: boolean;
    }>();

    startThesinatorSessionMock.mockResolvedValue(baseStartResponse);
    sendThesinatorTurnMock.mockReturnValue(turnDeferred.promise);

    render(<StepGenieChat onComplete={vi.fn()} />);

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.click(screen.getByRole("button", { name: "Option A" }));

    act(() => {
      vi.advanceTimersByTime(130);
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByText("Taking a bit longer than usual, but still working on your next step."),
    ).toBeInTheDocument();

    await act(async () => {
      turnDeferred.resolve({
        session_id: "session-1",
        client_token: "client-2",
        assistant_reply: "Nice, let us narrow it down.",
        audio_b64: null,
        next_question: {
          id: 2,
          question: "Which impact matters most to you?",
          options: ["Impact A", "Impact B", "Impact C", "Impact D"],
        },
        question_index: 1,
        is_complete: false,
      });
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
  });
});
