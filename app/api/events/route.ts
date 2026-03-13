import { NextResponse } from "next/server";
import eventsData from "@/data/events.json";
import { Event } from "@/types";
import { fetchLumaEvents } from "@/lib/luma";

export async function GET() {
  const manual = eventsData as Event[];

  let lumaEvents: Event[] = [];
  try {
    lumaEvents = await fetchLumaEvents();
  } catch (err) {
    console.error("Failed to fetch Luma events:", err);
  }

  // Dedupe: manual events win; skip Luma events whose lumaEventId matches any manual entry
  const manualLumaIds = new Set(
    manual.map((e) => e.lumaEventId).filter(Boolean)
  );

  const uniqueLuma = lumaEvents.filter(
    (e) => !manualLumaIds.has(e.lumaEventId)
  );

  const merged = [...manual, ...uniqueLuma].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return NextResponse.json(merged);
}
