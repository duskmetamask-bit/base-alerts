import { NextRequest, NextResponse } from "next/server";
import { createEvent, EventAttributes } from "ics";
import eventsData from "@/data/events.json";
import { Event } from "@/types";
import { fetchLumaEvents } from "@/lib/luma";

function toIcsDate(iso: string): [number, number, number, number, number] {
  const d = new Date(iso);
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let lumaEvents: Event[] = [];
  try {
    lumaEvents = await fetchLumaEvents();
  } catch {
    // fall back to manual-only if Luma is unavailable
  }
  const allEvents = [...(eventsData as Event[]), ...lumaEvents];
  const event = allEvents.find((e) => e.id === id);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const eventAttributes: EventAttributes = {
    uid: `${event.id}@base-alerts`,
    title: event.title,
    description: `${event.description}\n\nMore info: ${event.url}`,
    start: toIcsDate(event.startDate),
    startInputType: "utc",
    end: toIcsDate(event.endDate),
    endInputType: "utc",
    location: event.location,
    url: event.url,
    status: "CONFIRMED",
    productId: "base-ecosystem-alerts",
  };

  const { error, value } = createEvent(eventAttributes);

  if (error || !value) {
    return NextResponse.json(
      { error: "Failed to generate ICS" },
      { status: 500 }
    );
  }

  return new NextResponse(value, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.id}.ics"`,
    },
  });
}
