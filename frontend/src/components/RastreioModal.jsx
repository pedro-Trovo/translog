import { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { rastrearEntrega, atualizarStatus, cancelarEntrega } from "../services/api";
import { STATUS_OPTIONS, getStatusStyle, getStatusLabel, TRANSICOES_VALIDAS } from "../utils/statusConfig";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Timeline({ historico = [] }) {
  return (
    <div className="relative space-y-0">
      {historico.map((item, i) => {
        const isFirst = i === 0;
        const isLast = i === historico.length - 1;
        const style = getStatusStyle(item.status);
        return (
          <div key={item.id || i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full border-2 ${isFirst ? "bg-cyan border-cyan" : "bg-white border-slate"}`} />
              {!isLast && <div className="w-0.5 flex-1 bg-border" />}
            </div>
            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
              <Badge className={`${style.bg} ${style.text} border-0 font-medium mb-1`}>
                {getStatusLabel(item.status)}
              </Badge>
              <p className="text-xs text-slate">{formatDate(item.registradoEm)}</p>
              {item.observacao && (
                <p className="text-sm text-text mt-1">{item.observacao}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RastreioModal({ codigo, onClose, onRefresh }) {
  const [entrega, setEntrega] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [novoStatus, setNovoStatus] = useState("");
  const [observacao, setObservacao] = useState("");
  const [updating, setUpdating] = useState(false);

  const [cancelMotivo, setCancelMotivo] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const open = !!codigo;

  useEffect(() => {
    if (!codigo) return;
    setLoading(true);
    setError(null);
    setNovoStatus("");
    setObservacao("");
    setShowCancel(false);
    setCancelMotivo("");
    rastrearEntrega(codigo)
      .then(setEntrega)
      .catch((err) => setError(err.response?.data?.erro || err.message))
      .finally(() => setLoading(false));
  }, [codigo]);

  const transicoes = entrega ? TRANSICOES_VALIDAS[entrega.statusAtual] || [] : [];

  async function handleUpdateStatus() {
    if (!novoStatus) return;
    setUpdating(true);
    try {
      await atualizarStatus(codigo, novoStatus, observacao);
      const updated = await rastrearEntrega(codigo);
      setEntrega(updated);
      setNovoStatus("");
      setObservacao("");
      onRefresh?.();
    } catch (err) {
      setError(err.response?.data?.erro || err.message);
    } finally {
      setUpdating(false);
    }
  }

  async function handleCancel() {
    if (!cancelMotivo) return;
    setCanceling(true);
    try {
      await cancelarEntrega(codigo, cancelMotivo);
      const updated = await rastrearEntrega(codigo);
      setEntrega(updated);
      setShowCancel(false);
      setCancelMotivo("");
      onRefresh?.();
    } catch (err) {
      setError(err.response?.data?.erro || err.message);
    } finally {
      setCanceling(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose?.(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan" />
            Rastreio — {codigo}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan" />
            <span className="ml-3 text-slate">Carregando...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {entrega && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate text-xs uppercase tracking-wide">Remetente</p>
                <p className="font-medium">{entrega.remetenteNome}</p>
                <p className="text-slate">{entrega.remetenteCidade}</p>
              </div>
              <div>
                <p className="text-slate text-xs uppercase tracking-wide">Destinatário</p>
                <p className="font-medium">{entrega.destinatarioNome}</p>
                <p className="text-slate">{entrega.destinatarioCidade}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate text-xs uppercase tracking-wide">Endereço de Entrega</p>
                <p>{entrega.destinatarioEndereco}</p>
              </div>
              <div>
                <p className="text-slate text-xs uppercase tracking-wide">Peso</p>
                <p>{entrega.pesoKg != null ? `${Number(entrega.pesoKg).toFixed(2)} kg` : "-"}</p>
              </div>
              <div>
                <p className="text-slate text-xs uppercase tracking-wide">Status Atual</p>
                <Badge className={`${getStatusStyle(entrega.statusAtual).bg} ${getStatusStyle(entrega.statusAtual).text} border-0 font-medium`}>
                  {getStatusLabel(entrega.statusAtual)}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-midnight mb-3">Histórico de Status</h4>
              {entrega.statusHistorico?.length > 0 ? (
                <Timeline historico={entrega.statusHistorico} />
              ) : (
                <p className="text-sm text-slate">Nenhum histórico registrado.</p>
              )}
            </div>

            {transicoes.length > 0 && (
              <div className="border-t border-border pt-4 space-y-3">
                <h4 className="text-sm font-semibold text-midnight">Atualizar Status</h4>
                <div className="flex gap-2">
                  <Select value={novoStatus} onValueChange={setNovoStatus}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Novo status..." />
                    </SelectTrigger>
                    <SelectContent>
                      {transicoes.map((s) => {
                        const opt = STATUS_OPTIONS.find((o) => o.value === s);
                        return (
                          <SelectItem key={s} value={s}>{opt?.label || s}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Observação (opcional)"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
                <Button onClick={handleUpdateStatus} disabled={!novoStatus || updating} className="w-full">
                  {updating ? "Atualizando..." : "Confirmar Atualização"}
                </Button>
              </div>
            )}

            {entrega.statusAtual !== "ENTREGUE" && entrega.statusAtual !== "CANCELADO" && (
              <div className="border-t border-border pt-4">
                {!showCancel ? (
                  <Button variant="outline" onClick={() => setShowCancel(true)} className="w-full text-red-600 border-red-200 hover:bg-red-50">
                    Cancelar Entrega
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-600 font-medium">Tem certeza? Informe o motivo:</p>
                    <Input
                      placeholder="Motivo do cancelamento"
                      value={cancelMotivo}
                      onChange={(e) => setCancelMotivo(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowCancel(false)} className="flex-1">
                        Voltar
                      </Button>
                      <Button onClick={handleCancel} disabled={!cancelMotivo || canceling} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                        {canceling ? "Cancelando..." : "Confirmar Cancelamento"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
