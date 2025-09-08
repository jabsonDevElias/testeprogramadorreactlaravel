// src/components/Play.test.tsx
import { render, screen } from "@testing-library/react";
import Play from "./Play";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mock do YouTube API
beforeAll(() => {
  (window as any).YT = {
    Player: vi.fn().mockImplementation((id, options) => ({
      playVideo: vi.fn(),
      pauseVideo: vi.fn(),
      getDuration: vi.fn(() => 100),
      getCurrentTime: vi.fn(() => 50),
    })),
    PlayerState: {
      PLAYING: 1,
      PAUSED: 2,
      ENDED: 0,
    },
  };
});

describe("Play Component", () => {
  const props = {
    titulo: "Música Teste",
    views: 123,
    id: 1,
    id_youtube: "abc123xyz01",
    apiReady: true,
    isActive: true,
    setActivePlayer: vi.fn(),
  };

  test("renderiza título, views e thumbnail", () => {
    render(
      <MemoryRouter>
        <Play {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText("Música Teste")).toBeInTheDocument();
    expect(screen.getByText("Views 123")).toBeInTheDocument();

    const thumbnailButton = screen.getByRole("button");
    expect(thumbnailButton).toBeInTheDocument();
  });

  test("barra de progresso está presente", () => {
    render(
      <MemoryRouter>
        <Play {...props} />
      </MemoryRouter>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });
});
