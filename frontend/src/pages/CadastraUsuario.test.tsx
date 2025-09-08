// src/components/CadastraUsuario.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CadastraUsuario from "./CadastraUsuario";
import { MemoryRouter } from "react-router-dom";
import api from "../service/api";
import { vi } from "vitest";

// Mock do axios
vi.mock("../service/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CadastraUsuario Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza inputs e botão", () => {
    render(
      <MemoryRouter>
        <CadastraUsuario />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Nome")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cadastrar/i })).toBeInTheDocument();
  });

  test("atualiza campos ao digitar", () => {
    render(
      <MemoryRouter>
        <CadastraUsuario />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Nome");
    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(passwordInput).toHaveValue("123456");
  });

  test("submete formulário e exibe modal com mensagem", async () => {
    (api.post as any).mockResolvedValueOnce({ data: { message: "Usuário cadastrado com sucesso!" } });

    render(
      <MemoryRouter>
        <CadastraUsuario />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Nome"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/cadastra-usuarios", {
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
      });
    });

    // Modal aparece com a mensagem
    expect(await screen.findByText("Usuário cadastrado com sucesso!")).toBeInTheDocument();

    // Fechar modal e navegar
    fireEvent.click(screen.getByRole("button", { name: /ok/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
