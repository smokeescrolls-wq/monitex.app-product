import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import HomePage from "./page";

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ push: vi.fn() }),
  };
});

describe("HomePage", () => {
  it("shows validation error on invalid username", async () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: /Analisar agora/i }));

    fireEvent.change(await screen.findByLabelText("Usuário do Instagram"), {
      target: { value: "john-doe" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Espionar agora/i }));

    expect(
      await screen.findByText(/Informe um usuário válido/i),
    ).toBeInTheDocument();
  });
});
