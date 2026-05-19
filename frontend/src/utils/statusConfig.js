export const STATUS_OPTIONS = [
  { value: "COLETADO", label: "Coletado" },
  { value: "EM_TRANSITO", label: "Em Trânsito" },
  { value: "SAIU_PARA_ENTREGA", label: "Saiu para Entrega" },
  { value: "ENTREGUE", label: "Entregue" },
  { value: "TENTATIVA_FALHA", label: "Tentativa Falha" },
  { value: "CANCELADO", label: "Cancelado" },
];

export const STATUS_STYLES = {
  COLETADO: { bg: "bg-[#CFFAFE]", text: "text-[#164E63]" },
  EM_TRANSITO: { bg: "bg-[#DBEAFE]", text: "text-[#1E3A8A]" },
  SAIU_PARA_ENTREGA: { bg: "bg-[#E0F2FE]", text: "text-[#0C4A6E]" },
  ENTREGUE: { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
  TENTATIVA_FALHA: { bg: "bg-[#FFEDD5]", text: "text-[#9A3412]" },
  CANCELADO: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
};

export function getStatusStyle(status) {
  return STATUS_STYLES[status] || { bg: "bg-gray-100", text: "text-gray-700" };
}

export function getStatusLabel(status) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status);
  return opt ? opt.label : status;
}

export const TRANSICOES_VALIDAS = {
  COLETADO: ["EM_TRANSITO", "CANCELADO"],
  EM_TRANSITO: ["SAIU_PARA_ENTREGA", "CANCELADO"],
  SAIU_PARA_ENTREGA: ["ENTREGUE", "TENTATIVA_FALHA", "CANCELADO"],
  TENTATIVA_FALHA: ["SAIU_PARA_ENTREGA", "CANCELADO"],
  ENTREGUE: [],
  CANCELADO: [],
};
