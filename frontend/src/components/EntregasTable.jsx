import { Package } from "lucide-react";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { getStatusStyle, getStatusLabel } from "../utils/statusConfig";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function EntregasTable({ entregas = [], onSelect }) {
  if (entregas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate">
        <Package className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Nenhuma entrega encontrada</p>
        <p className="text-sm">Tente ajustar os filtros ou período.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Remetente</TableHead>
          <TableHead>Destinatário</TableHead>
          <TableHead>Cidade Destino</TableHead>
          <TableHead>Peso (kg)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entregas.map((entrega) => {
          const style = getStatusStyle(entrega.statusAtual);
          return (
            <TableRow
              key={entrega.id || entrega.codigoRastreio}
              className="cursor-pointer"
              onClick={() => onSelect?.(entrega)}
            >
              <TableCell className="font-medium text-blue">{entrega.codigoRastreio}</TableCell>
              <TableCell>{entrega.remetenteNome}</TableCell>
              <TableCell>{entrega.destinatarioNome}</TableCell>
              <TableCell>{entrega.destinatarioCidade}</TableCell>
              <TableCell>{entrega.pesoKg != null ? Number(entrega.pesoKg).toFixed(2) : "-"}</TableCell>
              <TableCell>
                <Badge className={`${style.bg} ${style.text} border-0 font-medium`}>
                  {getStatusLabel(entrega.statusAtual)}
                </Badge>
              </TableCell>
              <TableCell className="text-slate">{formatDate(entrega.criadoEm)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
