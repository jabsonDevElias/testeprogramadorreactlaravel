import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "./Navbar";
import api from "../service/api";
import { BrowserRouter } from "react-router-dom";

// Mock do api
vi.mock("../service/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Navbar component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("mostra nome do usuário quando API retorna nome", async () => {
    (api.post as any).mockResolvedValue({ data: { name: "Jabson" } });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Jabson")).toBeInTheDocument();
    });
  });

  it("mostra botão de login quando não há usuário", async () => {
    (api.post as any).mockRejectedValue(new Error("No token"));

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      
      // Simula clique no botão de login
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("faz logout corretamente", async () => {
    (api.post as any).mockResolvedValue({ data: { name: "Jabson" } });

    // Mock window.location.reload corretamente
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadSpy },
      writable: true,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    await waitFor(() => {
      const logoutBtn = screen.getByRole("button");
      fireEvent.click(logoutBtn);

      expect(localStorage.getItem("authToken")).toBeNull();
      expect(localStorage.getItem("authNome")).toBeNull();
      expect(localStorage.getItem("authId")).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});
