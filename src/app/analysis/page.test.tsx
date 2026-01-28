import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import AnalysisClient from "@/features/analysis/analysis.client";
import { useSessionStore } from "@/features/session/session.store";

const push = vi.fn();

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ push }),
    useSearchParams: () => new URLSearchParams("username=john"),
  };
});

describe("AnalysisClient", () => {
  beforeEach(() => {
    push.mockReset();
    useSessionStore.setState({
      searchCount: 0,
      lastUsername: undefined,
      accessStartedAt: undefined,
      accessDurationMs: 30 * 60 * 1000,
      isVip: false,
      consumeSearch: useSessionStore.getState().consumeSearch,
      startAccess: useSessionStore.getState().startAccess,
      resetSession: useSessionStore.getState().resetSession,
      setVip: useSessionStore.getState().setVip,
    });
  });

  it("navigates to feed on confirm", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              data: {
                profileDetails: {
                  isPrivate: false,
                  isVerified: false,
                  fullName: "John",
                  username: "john",
                  biography: "bio",
                  followersCount: 1,
                  followsCount: 2,
                  postsCount: 3,
                  pictureUrl: "https://example.com/a.jpg",
                },
              },
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
      ),
    );

    render(<AnalysisClient />);

    expect(await screen.findByText(/Confirmação/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Confirmar e continuar/i }),
    );

    expect(push).toHaveBeenCalledWith("/feed?username=john");
  });
});
