"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  Lightbulb,
  MessageSquareQuote,
  BookmarkPlus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COMMERCIAL_DATES, getMonthEvents, type CommercialDate } from "@/lib/dates-br";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const TYPE_COLORS: Record<CommercialDate["type"], string> = {
  holiday: "bg-red-500",
  commemorative: "bg-violet-500",
  commercial: "bg-blue-500",
};

const TYPE_LABELS: Record<CommercialDate["type"], string> = {
  holiday: "Feriado",
  commemorative: "Comemorativa",
  commercial: "Comercial",
};

const TYPE_BADGE: Record<CommercialDate["type"], string> = {
  holiday: "bg-red-500/10 text-red-400 border-red-500/20",
  commemorative: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  commercial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export function CommemorativeCalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selected, setSelected] = useState<CommercialDate[] | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [savingIdea, setSavingIdea] = useState<string | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const monthEvents = getMonthEvents(month);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
    setSelectedDay(null);
  }

  function handleDayClick(day: number) {
    const events = monthEvents.filter(e => e.day === day);
    if (events.length > 0) {
      setSelected(events);
      setSelectedDay(day);
    }
  }

  async function saveIdea(idea: string, dateTitle: string) {
    const key = `${dateTitle}:${idea}`;
    setSavingIdea(key);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSavingIdea(null); return; }

    const { error } = await supabase.from("ideas").insert({
      user_id: user.id,
      title: idea,
      description: `Ideia para ${dateTitle}`,
      status: "new",
    });

    setSavingIdea(null);
    if (error) {
      toast({ title: "Erro ao salvar ideia", description: error.message, variant: "destructive" });
    } else {
      setSavedIdeas(prev => new Set([...prev, key]));
      toast({ title: "Ideia salva!", description: `"${idea.slice(0, 40)}..." foi adicionada ao banco de ideias.` });
    }
  }

  // Build calendar grid
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

  return (
    <div className="flex gap-6 h-full">
      {/* Calendar */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold w-44 text-center">
              {MONTH_NAMES[month - 1]} {year}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {(["holiday", "commemorative", "commercial"] as const).map(type => (
              <span key={type} className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", TYPE_COLORS[type])} />
                {TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const events = monthEvents.filter(e => e.day === day);
            const isSelected = selectedDay === day;
            const todayStyle = isToday(day);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm transition-all border",
                  events.length > 0
                    ? "cursor-pointer hover:bg-sidebar-accent"
                    : "cursor-default",
                  isSelected
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : todayStyle
                    ? "bg-sidebar-accent border-border text-foreground font-bold"
                    : "border-transparent text-foreground"
                )}
              >
                <span className={cn("text-xs font-medium", todayStyle && !isSelected && "text-primary")}>
                  {day}
                </span>
                {events.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                    {events.slice(0, 3).map((e, idx) => (
                      <span key={idx} className={cn("w-1.5 h-1.5 rounded-full", TYPE_COLORS[e.type])} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Monthly summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">
            {monthEvents.length} {monthEvents.length === 1 ? "data especial" : "datas especiais"} em {MONTH_NAMES[month - 1]}
          </p>
          <div className="flex flex-wrap gap-2">
            {monthEvents.map((e, i) => (
              <button
                key={i}
                onClick={() => { setSelected(monthEvents.filter(ev => ev.day === e.day)); setSelectedDay(e.day); }}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors",
                  selectedDay === e.day
                    ? TYPE_BADGE[e.type]
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                <span>{e.emoji}</span>
                <span>{e.day}/{month} — {e.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side panel */}
      {selected && selected.length > 0 && (
        <div className="w-96 shrink-0 bg-card border border-border rounded-xl overflow-y-auto max-h-[calc(100vh-10rem)]">
          <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                {selectedDay}/{month}/{year}
              </p>
              <h3 className="font-semibold text-sm">
                {selected.length === 1 ? selected[0].title : `${selected.length} datas`}
              </h3>
            </div>
            <button
              onClick={() => { setSelected(null); setSelectedDay(null); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {selected.map((event, ei) => (
              <div key={ei} className={cn(selected.length > 1 && "pb-6 border-b border-border last:border-0 last:pb-0")}>
                {/* Title + badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{event.emoji}</span>
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", TYPE_BADGE[event.type])}>
                      {TYPE_LABELS[event.type]}
                    </span>
                  </div>
                </div>

                {/* Niches */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    Nichos relevantes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {event.niches.map((niche, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-sidebar-accent border border-border">
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ideas */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Ideias de conteúdo
                  </div>
                  <div className="space-y-2">
                    {event.ideas.map((idea, i) => {
                      const key = `${event.title}:${idea}`;
                      const isSaved = savedIdeas.has(key);
                      const isSaving = savingIdea === key;
                      return (
                        <div key={i} className="flex items-start gap-2 group">
                          <p className="flex-1 text-xs text-foreground leading-relaxed">{idea}</p>
                          <button
                            onClick={() => !isSaved && saveIdea(idea, event.title)}
                            disabled={isSaving || isSaved}
                            title={isSaved ? "Salvo!" : "Salvar no banco de ideias"}
                            className={cn(
                              "shrink-0 mt-0.5 transition-colors",
                              isSaved
                                ? "text-green-400"
                                : "text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100"
                            )}
                          >
                            {isSaved
                              ? <Check className="w-3.5 h-3.5" />
                              : <BookmarkPlus className="w-3.5 h-3.5" />
                            }
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hooks */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    Hooks / chamadas
                  </div>
                  <div className="space-y-2">
                    {event.hooks.map((hook, i) => (
                      <div key={i} className="text-xs italic text-muted-foreground border-l-2 border-primary/30 pl-3 py-0.5">
                        "{hook}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for panel */}
      {!selected && (
        <div className="w-80 shrink-0 flex flex-col items-center justify-center text-center text-muted-foreground bg-card border border-border border-dashed rounded-xl p-8 gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Selecione uma data</p>
            <p className="text-xs mt-1">Clique em um dia com pontos coloridos para ver ideias, nichos e hooks.</p>
          </div>
        </div>
      )}
    </div>
  );
}
