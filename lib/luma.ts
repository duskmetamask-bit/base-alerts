import ical from "node-ical";
import { Event } from "@/types";

const LUMA_ICAL_URL =
  "https://api2.luma.com/ics/get?entity=user&id=icssk-zjWe64K0scWtm5i";

function getText(value: string | { val: string; params?: unknown } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.val ?? "";
}

export async function fetchLumaEvents(): Promise<Event[]> {
  const data = await ical.fromURL(LUMA_ICAL_URL);

  const events: Event[] = [];

  for (const component of Object.values(data)) {
    if (!component || component.type !== "VEVENT") continue;

    const vevent = component as ical.VEvent;
    const title = getText(vevent.summary);
    if (!title) continue;

    const startDate = vevent.start ? new Date(vevent.start).toISOString() : "";
    const endDate = vevent.end ? new Date(vevent.end).toISOString() : startDate;

    events.push({
      id: vevent.uid ?? `luma-${Buffer.from(title + startDate).toString("base64url").slice(0, 16)}`,
      title,
      description: getText(vevent.description as string | { val: string } | undefined),
      category: "community",
      startDate,
      endDate,
      location: getText(vevent.location),
      url: typeof vevent.url === "string" ? vevent.url : getText(vevent.url as { val: string } | undefined),
      lumaEventId: vevent.uid,
      source: "luma",
    });
  }

  return events;
}
