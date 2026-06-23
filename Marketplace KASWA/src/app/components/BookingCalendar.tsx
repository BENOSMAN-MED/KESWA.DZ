import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventInput } from "@fullcalendar/core";
import frLocale from "@fullcalendar/core/locales/fr";

interface BlockedRange {
  debut: string;
  fin: string;
}

interface BookingCalendarProps {
  blockedRanges: BlockedRange[];
  startDate: string;
  endDate: string;
  onSelect: (start: string, end: string) => void;
}

export function BookingCalendar({ blockedRanges, startDate, endDate, onSelect }: BookingCalendarProps) {
  const today = new Date().toISOString().split("T")[0];

  const events: EventInput[] = [
    ...blockedRanges.map((r) => ({
      start: r.debut,
      // FullCalendar exclusive end: day after fin
      end: addDays(r.fin, 1),
      display: "background",
      color: "#ef4444",
      classNames: ["blocked-range"],
    })),
    ...(startDate && endDate
      ? [
          {
            start: startDate,
            end: addDays(endDate, 1),
            display: "background",
            color: "#1B4D3E",
            classNames: ["selected-range"],
          },
        ]
      : []),
  ];

  const handleSelect = (info: DateSelectArg) => {
    const start = info.startStr;
    // FullCalendar gives exclusive end, so subtract a day
    const end = subtractDays(info.endStr, 1);
    if (end < start) return;
    onSelect(start, end);
  };

  return (
    <div className="booking-calendar">
      <style>{`
        .booking-calendar .fc { font-family: inherit; font-size: 0.82rem; }
        .booking-calendar .fc-toolbar-title { font-size: 0.9rem; font-weight: 700; color: #1B4D3E; }
        .booking-calendar .fc-button { background: #1B4D3E !important; border-color: #1B4D3E !important; font-size: 0.75rem !important; padding: 3px 8px !important; }
        .booking-calendar .fc-button:hover { background: #2d6b55 !important; }
        .booking-calendar .fc-day-today { background: #FAF6EF !important; }
        .booking-calendar .blocked-range { opacity: 0.6; }
        .booking-calendar .selected-range { opacity: 0.35; }
        .booking-calendar .fc-daygrid-day-number { color: #374151; font-size: 0.78rem; }
        .booking-calendar .fc-col-header-cell-cushion { color: #6b7280; font-size: 0.75rem; font-weight: 600; }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        selectable
        selectMirror
        unselectAuto
        validRange={{ start: today }}
        events={events}
        select={handleSelect}
        headerToolbar={{ left: "prev", center: "title", right: "next" }}
        height="auto"
        aspectRatio={1.4}
        selectConstraint={{ start: today }}
        businessHours={false}
        selectOverlap={(event) => event.display !== "background" || !event.classNames?.includes("blocked-range")}
      />
      <div className="flex gap-3 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-400 opacity-70 inline-block" />Indisponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#1B4D3E] opacity-40 inline-block" />Période sélectionnée
        </span>
      </div>
    </div>
  );
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function subtractDays(dateStr: string, n: number): string {
  return addDays(dateStr, -n);
}
