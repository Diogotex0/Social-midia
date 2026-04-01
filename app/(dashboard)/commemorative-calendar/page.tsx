import { CommemorativeCalendarView } from "@/components/commemorative-calendar/commemorative-calendar-view";

export const metadata = { title: "Calendário Comercial — SocialNext" };

export default function CommemorativeCalendarPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendário Comercial</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Datas comemorativas, feriados e oportunidades comerciais com ideias de conteúdo para cada data.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <CommemorativeCalendarView />
      </div>
    </div>
  );
}
