import { useState } from "react";
import { Package, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { criarEntrega } from "../services/api";

const FIELDS = [
  { name: "remetenteNome", label: "Nome do Remetente", required: true },
  { name: "remetenteCidade", label: "Cidade do Remetente", required: true },
  { name: "destinatarioNome", label: "Nome do Destinatário", required: true },
  { name: "destinatarioCidade", label: "Cidade do Destinatário", required: true },
  { name: "destinatarioEndereco", label: "Endereço de Entrega", required: true },
  { name: "pesoKg", label: "Peso (kg)", type: "number", required: false },
];

export default function NovaEntregaForm({ onRefresh }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    for (const field of FIELDS) {
      if (field.required && !form[field.name]?.trim()) {
        errs[field.name] = "Campo obrigatório";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = { ...form };
      if (payload.pesoKg) payload.pesoKg = parseFloat(payload.pesoKg);
      await criarEntrega(payload);
      setForm({});
      setOpen(false);
      onRefresh?.();
    } catch (err) {
      setSubmitError(err.response?.data?.erro || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Entrega
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-cyan" />
            Nova Entrega
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium text-midnight block mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Input
                name={field.name}
                type={field.type || "text"}
                value={form[field.name] || ""}
                onChange={handleChange}
                className={errors[field.name] ? "border-red-400" : ""}
              />
              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar Entrega"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
