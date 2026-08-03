import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000"; //ip do pc (trocar caso necessário)!!!!!!

export const socket = io(BASE_URL, {
  autoConnect: true
});

export const fetchAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  return response.json();
};
