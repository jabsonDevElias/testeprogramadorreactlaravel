import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sugestao from "./Sugestao";
import api from "../service/api";
import { vi } from "vitest";

// Mock do api
vi.mock("../service/api", () => ({
  default: {
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: { reload: vi.fn() },
  writable: true,
});

describe("Sugestao Component", () => {
  const musicaProps = {
    id: 1,
    titulo: "Música Teste",
    views: 123,
    id_youtube: "abc123xyz01",
    data: "07/09/2025 10:00:00",
  };

  beforeEach(() => {
    window.localStorage.setItem("authToken", "token123"); // Simula usuário logado
    vi.clearAllMocks();
  });

  test("botão aprovar chama api.put e recarrega a página", async () => {
    render(<Sugestao {...musicaProps} />);
    const btnAprovar = screen.getByRole("button", { name: /aprovar música/i });

    fireEvent.click(btnAprovar);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/autorizar-musicas/${musicaProps.id}`);
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test("botão reprovar chama api.delete e recarrega a página", async () => {
    render(<Sugestao {...musicaProps} />);
    const btnReprovar = screen.getByRole("button", { name: /reprovar música/i });

    fireEvent.click(btnReprovar);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/deletar-musicas/${musicaProps.id}`);
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
