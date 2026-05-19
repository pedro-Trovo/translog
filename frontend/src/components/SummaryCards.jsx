import { Card, CardContent } from "./ui/card";
import { Package, CheckCircle, Navigation, XCircle } from "lucide-react";
import { getStatusLabel } from "../utils/statusConfig";

const CARDS = [
  {
    key: "total",
    label: "Total de Entregas",
    icon: Package,
    color: "text-midnight",
    bg: "bg-midnight/5",
    getValue: (data) => data.length,
  },
  {
    key: "entregues",
    label: "Entregues",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    getValue: (data) => data.filter((e) => e.statusAtual === "ENTREGUE").length,
  },
  {
    key: "emTransito",
    label: "Em Trânsito",
    icon: Navigation,
    color: "text-blue-600",
    bg: "bg-blue-50",
    getValue: (data) =>
      data.filter((e) => ["COLETADO", "EM_TRANSITO", "SAIU_PARA_ENTREGA"].includes(e.statusAtual)).length,
  },
  {
    key: "canceladas",
    label: "Canceladas",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    getValue: (data) => data.filter((e) => e.statusAtual === "CANCELADO").length,
  },
];

export default function SummaryCards({ entregas = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, color, bg, getValue }) => (
        <Card key={key} className="border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-lg p-3 ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-slate">{label}</p>
              <p className="text-2xl font-bold text-midnight">{getValue(entregas)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
