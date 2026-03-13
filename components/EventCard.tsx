"use client";

import { Event, EventCategory } from "@/types";
import CalendarExport from "./CalendarExport";

const CATEGORY_STYLES: Record<
  EventCategory,
  { label: string; color: string; bg: string }
> = {
  community: {
    label: "Community",
    color: "#00C2FF",
    bg: "rgba(0, 194, 255, 0.1)",
  },
  conference: {
    label: "Conference",
    color: "#7B9EFF",
    bg: "rgba(123, 158, 255, 0.1)",
  },
  campaign: {
    label: "Campaign",
    color: "#00E5A0",
    bg: "rgba(0, 229, 160, 0.1)",
  },
  grant: {
    label: "Grant",
    color: "#FFB547",
    bg: "rgba(255, 181, 71, 0.1)",
  },
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);

  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const sameDay = s.toDateString() === e.toDateString();
  if (sameDay) {
    return s.toLocaleDateString("en-US", opts);
  }

  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", opts)}`;
  }

  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
}

function isUpcoming(endDate: string): boolean {
  return new Date(endDate) > new Date();
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const style = CATEGORY_STYLES[event.category];
  const upcoming = isUpcoming(event.endDate);

  return (
    <article
      className="glass rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:border-white/[0.14]"
      style={{ opacity: upcoming ? 1 : 0.55 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ color: style.color, background: style.bg }}
            >
              {style.label}
            </span>
            {!upcoming && (
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  color: "var(--muted)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                Past
              </span>
            )}
          </div>
          <h3
            className="text-lg font-semibold leading-snug"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {event.title}
          </h3>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {event.description}
      </p>

      <div
        className="flex items-center gap-4 text-xs"
        style={{ color: "var(--muted)" }}
      >
        <span className="flex items-center gap-1.5">
          <ClockIcon />
          {formatDateRange(event.startDate, event.endDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <LocationIcon />
          {event.location}
        </span>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <CalendarExport event={event} />
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-colors duration-150"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)")
          }
        >
          Learn more &rarr;
        </a>
      </div>
    </article>
  );
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6 3.5V6l2 1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="6" cy="4.5" r="1.25" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
