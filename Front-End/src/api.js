import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000"; //ip do pc (trocar caso necessário)!!!!!!

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
    // Lança um erro com a mensagem vinda do backend (ex: "Token inválido ou expirado")
    throw new Error(data.Error || data.error || `Erro na requisição (${response.status})`);
  }

  return data;
};
