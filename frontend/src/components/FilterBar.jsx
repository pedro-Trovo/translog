import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { STATUS_OPTIONS } from "../utils/statusConfig";
import { cn } from "../lib/utils";

export default function FilterBar({ filtros, onFilterChange }) {
  const [search, setSearch] = useState("");

  const handleDateSelect = (range) => {
    onFilterChange({
      ...filtros,
      dataInicio: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      dataFim: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ ...filtros, status });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ ...filtros, search: value });
  };

  const selectedRange = {
    from: filtros.dataInicio ? new Date(filtros.dataInicio + "T00:00:00") : undefined,
    to: filtros.dataFim ? new Date(filtros.dataFim + "T00:00:00") : undefined,
  };

  const dateLabel = selectedRange.from
    ? selectedRange.to
      ? `${format(selectedRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(selectedRange.to, "dd/MM/yyyy", { locale: ptBR })}`
      : format(selectedRange.from, "dd/MM/yyyy", { locale: ptBR })
    : "Selecione o período";

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !selectedRange.from && "text-slate",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <Select value={filtros.status || "_all"} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">Todos os status</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
        <Input
          placeholder="Buscar por código de rastreio..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
    </div>
  );
}
