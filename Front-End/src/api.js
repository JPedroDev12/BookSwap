import { io } from "socket.io-client";

// Em vez de fixar "localhost" (que só funciona testando no mesmo PC do servidor),
// usa o mesmo host que foi digitado no navegador para acessar o site.
// Ex: acessando de outro PC por http://192.168.0.10:5173, o backend
// será chamado em http://192.168.0.10:3000 automaticamente.
const BASE_URL = `http://${window.location.hostname}:3000`;

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
