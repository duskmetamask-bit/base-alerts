import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { Event } from "@/types";
import { fetchLumaEvents } from "@/lib/luma";

export async function GET() {
  const filePath = path.join(process.cwd(), "data/events.json");
  const manualEvents: Event[] = JSON.parse(readFileSync(filePath, "utf-8")).map(
    (e: Event) => ({ ...e, source: "manual" as const })
  );

  let lumaEvents: Event[] = [];
  try {
    lumaEvents = await fetchLumaEvents();
  } catch (err) {
    console.error("Failed to fetch Luma iCal events:", err);
  }

  // Dedupe by title + startDate (prefer manual over luma)
  const seen = new Set<string>();
  const merged: Event[] = [];

  for (const event of [...manualEvents, ...lumaEvents]) {
    const key = `${event.title}__${event.startDate.slice(0, 10)}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(event);
    }
  }

  const sorted = merged.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return NextResponse.json(sorted);
}
