"use client";

import { Event } from "@/types";

interface CalendarExportProps {
  event: Event;
}

export default function CalendarExport({ event }: CalendarExportProps) {
  const handleExport = async () => {
    try {
      const res = await fetch(`/api/export-ics?id=${event.id}`);
      if (!res.ok) throw new Error("Failed to generate calendar file");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event.id}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
      style={{
        background: "rgba(0, 82, 255, 0.15)",
        border: "1px solid rgba(0, 82, 255, 0.4)",
        color: "#00C2FF",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(0, 82, 255, 0.28)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(0, 82, 255, 0.15)";
      }}
    >
      <CalendarIcon />
      Add to Calendar
    </button>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="2.5"
        width="12"
        height="10.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M1 5.5h12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M4.5 1v3M9.5 1v3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9" r="0.75" fill="currentColor" />
      <circle cx="4.5" cy="9" r="0.75" fill="currentColor" />
      <circle cx="9.5" cy="9" r="0.75" fill="currentColor" />
    </svg>
  );
}
