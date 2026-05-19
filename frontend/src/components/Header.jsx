import { Truck } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-midnight text-white px-6 py-4 flex items-center gap-4 shadow-md">
      <img src="/logo.svg" alt="TransLog" className="h-10" />
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6 text-cyan" />
        <h1 className="text-xl font-bold tracking-tight">Painel de Entregas</h1>
      </div>
    </header>
  );
}
