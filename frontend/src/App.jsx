import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import FilterBar from "./components/FilterBar";
import EntregasTable from "./components/EntregasTable";
import { listarEntregas } from "./services/api";

function getTodayRange() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return { dataInicio: `${yyyy}-${mm}-${dd}`, dataFim: `${yyyy}-${mm}-${dd}` };
}

export default function App() {
  const today = getTodayRange();
  const [filtros, setFiltros] = useState({ ...today, status: "_all", search: "" });
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntregas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
      if (filtros.dataFim) params.dataFim = filtros.dataFim;
      if (filtros.status && filtros.status !== "_all") params.status = filtros.status;
      const data = await listarEntregas(params);
      setEntregas(data);
    } catch (err) {
      setError(err.response?.data?.erro || err.message);
      setEntregas([]);
    } finally {
      setLoading(false);
    }
  }, [filtros.dataInicio, filtros.dataFim, filtros.status]);

  useEffect(() => {
    fetchEntregas();
  }, [fetchEntregas]);

  const filteredEntregas = useMemo(() => {
    if (!filtros.search) return entregas;
    const q = filtros.search.toLowerCase();
    return entregas.filter((e) => e.codigoRastreio?.toLowerCase().includes(q));
  }, [entregas, filtros.search]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <FilterBar filtros={filtros} onFilterChange={setFiltros} />

        <SummaryCards entregas={filteredEntregas} />

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan" />
            <span className="ml-3 text-slate">Carregando entregas...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            Erro ao carregar entregas: {error}
          </div>
        )}

        {!loading && !error && <EntregasTable entregas={filteredEntregas} onSelect={() => {}} />}
      </main>
    </div>
  );
}
