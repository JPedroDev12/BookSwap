import { io } from "socket.io-client";

// Se VITE_API_URL estiver definida no .env, usa ela. Senão, usa o mesmo
// host que foi digitado no navegador para acessar o site (em vez de fixar
// "localhost", que só funciona testando no mesmo PC do servidor).
const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

export const socket = io(BASE_URL, {
  autoConnect: true
});

export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Lança um erro com a mensagem vinda do backend (ex: "Token inválido ou expirado"),
    // incluindo o detalhe técnico quando o backend manda um (ajuda a depurar).
    const mensagem = data.Error || data.error || `Erro na requisição (${response.status})`;
    throw new Error(data.Detalhe ? `${mensagem} — ${data.Detalhe}` : mensagem);
  }

  return data;
};
