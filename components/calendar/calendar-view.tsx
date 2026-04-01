"use client";

import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths, isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CONTENT_STATUSES, PLATFORMS } from "@/types";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  format: string;
  status: string;
  scheduled_at: string;
  client_id: string;
  clients: { id: string; name: string; color: string } | null;
}

interface ClientRef { id: string; name: string; color: string }

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarView({ contents, clients }: { contents: ContentItem[]; clients: ClientRef[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterClient, setFilterClient] = useState("all");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const filtered = contents.filter(c =>
    filterClient === "all" || c.client_id === filterClient
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function getContentsForDay(day: Date) {
    const dayStr = format(day, "yyyy-MM-dd");
    return filtered.filter(c => c.scheduled_at.slice(0, 10) === dayStr);
  }

  const selectedContents = selectedDay ? getContentsForDay(selectedDay) : [];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold capitalize min-w-40 text-center">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs text-muted-foreground">
            Hoje
          </Button>
        </div>
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos clientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos clientes</SelectItem>
            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendar grid */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden">
          {/* Weekdays header */}
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map(day => (
              <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayContents = getContentsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const today = isToday(day);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "min-h-24 p-1.5 border-b border-r border-border/50 cursor-pointer transition-colors",
                    !isCurrentMonth && "opacity-30",
                    isSelected && "bg-primary/10",
                    today && "bg-primary/5",
                    "hover:bg-accent/50"
                  )}
                >
                  <span className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    today && "bg-primary text-white font-bold",
                    !today && "text-muted-foreground"
                  )}>
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayContents.slice(0, 3).map(content => {
                      const statusInfo = CONTENT_STATUSES.find(s => s.value === content.status);
                      return (
                        <div
                          key={content.id}
                          className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium"
                          style={{
                            backgroundColor: (content.clients?.color ?? "#6366f1") + "25",
                            color: content.clients?.color ?? "#6366f1",
                            borderLeft: `2px solid ${content.clients?.color ?? "#6366f1"}`,
                          }}
                          title={content.title}
                        >
                          {content.title}
                        </div>
                      );
                    })}
                    {dayContents.length > 3 && (
                      <p className="text-[10px] text-muted-foreground px-1">+{dayContents.length - 3} mais</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">
            {selectedDay
              ? format(selectedDay, "EEEE, d 'de' MMMM", { locale: ptBR })
              : "Clique em um dia"}
          </h3>

          {selectedDay && selectedContents.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              Sem conteúdos neste dia
            </p>
          )}

          <div className="space-y-2">
            {selectedContents.map(content => {
              const statusInfo = CONTENT_STATUSES.find(s => s.value === content.status);
              const platformInfo = PLATFORMS.find(p => p.value === content.platform);
              return (
                <div
                  key={content.id}
                  className="p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
                  style={{ borderLeftColor: content.clients?.color, borderLeftWidth: 3 }}
                >
                  <p className="text-xs font-medium truncate">{content.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{content.clients?.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`text-[10px] ${statusInfo?.color}`}>{statusInfo?.label}</Badge>
                    <span className="text-[10px] text-muted-foreground">{platformInfo?.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {CONTENT_STATUSES.map(s => (
          <div key={s.value} className="flex items-center gap-1.5">
            <Badge className={`text-[10px] ${s.color}`}>{s.label}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
