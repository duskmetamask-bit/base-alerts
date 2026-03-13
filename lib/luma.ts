import { Event } from "@/types";

const LUMA_API_BASE = "https://api.lu.ma/public/v1";
const CALENDAR_API_ID = "cal-kK8YR3PD1sXtXLb"; // lu.ma/baseevents

interface LumaGeoAddress {
  full_address?: string;
  city?: string;
  city_state?: string;
}

interface LumaEvent {
  api_id: string;
  name: string;
  description?: string;
  start_at: string;
  end_at: string;
  url: string;
  location_type?: "offline" | "online" | "hybrid";
  geo_address_info?: LumaGeoAddress;
}

interface LumaEntry {
  api_id: string;
  event: LumaEvent;
}

interface LumaResponse {
  entries: LumaEntry[];
  has_more: boolean;
  next_cursor?: string | null;
}

function mapLumaEvent(entry: LumaEntry): Event {
  const e = entry.event;

  let location = "Online";
  if (e.location_type !== "online" && e.geo_address_info) {
    location =
      e.geo_address_info.full_address ||
      e.geo_address_info.city_state ||
      e.geo_address_info.city ||
      "TBD";
  }

  return {
    id: `luma-${e.api_id}`,
    lumaEventId: e.api_id,
    title: e.name,
    description: e.description ?? "",
    category: "community",
    startDate: e.start_at,
    endDate: e.end_at,
    location,
    url: `https://lu.ma/${e.url}`,
  };
}

export async function fetchLumaEvents(): Promise<Event[]> {
  const apiKey = process.env.LUMA_API_KEY;
  if (!apiKey) {
    console.warn("LUMA_API_KEY not set — skipping Luma fetch");
    return [];
  }

  const allEvents: Event[] = [];
  let cursor: string | null | undefined = undefined;

  do {
    const params = new URLSearchParams({ calendar_api_id: CALENDAR_API_ID });
    if (cursor) params.set("pagination_cursor", cursor);

    const res = await fetch(
      `${LUMA_API_BASE}/calendar/list-events?${params}`,
      {
        headers: {
          "x-luma-api-key": apiKey,
          accept: "application/json",
        },
        next: { revalidate: 300 }, // cache 5 minutes
      }
    );

    if (!res.ok) {
      console.error(`Luma API error: ${res.status} ${res.statusText}`);
      break;
    }

    const data: LumaResponse = await res.json();
    allEvents.push(...data.entries.map(mapLumaEvent));
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return allEvents;
}
