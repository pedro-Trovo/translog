import ReactEChartsCore from "echarts-for-react/esm/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart3 } from "lucide-react";
import { STATUS_OPTIONS, getStatusLabel } from "../utils/statusConfig";

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

const CHART_COLORS = {
  COLETADO: "#3B82F6",
  EM_TRANSITO: "#EAB308",
  SAIU_PARA_ENTREGA: "#A855F7",
  ENTREGUE: "#22C55E",
  TENTATIVA_FALHA: "#F97316",
  CANCELADO: "#EF4444",
};

export default function StatusChart({ entregas = [] }) {
  const counts = {};
  for (const s of STATUS_OPTIONS) {
    counts[s.value] = 0;
  }
  for (const e of entregas) {
    if (counts[e.statusAtual] !== undefined) {
      counts[e.statusAtual]++;
    }
  }

  const data = STATUS_OPTIONS.map((s) => ({
    value: counts[s.value],
    itemStyle: { color: CHART_COLORS[s.value] || "#64748B" },
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "3%",
      right: "8%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: { color: "#64748B" },
      splitLine: { lineStyle: { color: "#E2E8F0" } },
    },
    yAxis: {
      type: "category",
      data: STATUS_OPTIONS.map((s) => getStatusLabel(s.value)).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#334155", fontWeight: 500 },
    },
    series: [
      {
        type: "bar",
        data: [...data].reverse(),
        barWidth: 20,
        borderRadius: [0, 4, 4, 0],
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-5 w-5 text-cyan" />
        <h3 className="text-sm font-semibold text-midnight">Entregas por Status</h3>
      </div>
      {entregas.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-slate text-sm">
          Nenhum dado para exibir
        </div>
      ) : (
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 260 }}
          notMerge
          lazyUpdate
        />
      )}
    </div>
  );
}
