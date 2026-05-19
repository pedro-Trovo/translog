import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

export async function listarEntregas(params = {}) {
  const { data } = await api.get("/entregas", { params });
  return data;
}

export async function rastrearEntrega(codigo) {
  const { data } = await api.get(`/entregas/${codigo}`);
  return data;
}

export async function criarEntrega(payload) {
  const { data } = await api.post("/entregas", payload);
  return data;
}

export async function atualizarStatus(codigo, status, observacao = "") {
  const { data } = await api.patch(`/entregas/${codigo}/status`, { status, observacao });
  return data;
}

export async function cancelarEntrega(codigo, motivo) {
  const { data } = await api.post(`/entregas/${codigo}/cancelar`, { motivo });
  return data;
}
