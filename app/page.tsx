import EventCard from "@/components/EventCard";
import { Event } from "@/types";

async function getEvents(): Promise<Event[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;
  try {
    const res = await fetch(`${baseUrl}/api/events`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const events = await getEvents();
  const upcoming = events.filter((e) => new Date(e.endDate) > new Date());
  const past = events.filter((e) => new Date(e.endDate) <= new Date());

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BaseIcon />
            <span
              className="font-semibold text-sm tracking-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Base Alerts
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            Base Ecosystem Events
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(0, 82, 255, 0.1)",
              border: "1px solid rgba(0, 82, 255, 0.25)",
              color: "#00C2FF",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#00C2FF" }}
            />
            Live on Base
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: "Syne, sans-serif", maxWidth: "640px" }}
          >
            Stay ahead of the{" "}
            <span style={{ color: "#00C2FF" }}>Base ecosystem</span>
          </h1>

          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "var(--muted)", maxWidth: "520px" }}
          >
            Hackathons, grants, campaigns, and conferences — all in one place.
            One click to add any event directly to your calendar.
          </p>

          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
            <Stat value={events.length} label="Events" />
            <div className="w-px h-4" style={{ background: "var(--border)" }} />
            <Stat value={upcoming.length} label="Upcoming" />
            <div className="w-px h-4" style={{ background: "var(--border)" }} />
            <Stat value={4} label="Categories" />
          </div>
        </section>

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section className="mb-14">
            <SectionLabel>Upcoming</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section>
            <SectionLabel>Past Events</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer
        className="border-t mt-20 py-8"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="max-w-5xl mx-auto px-6 text-xs"
          style={{ color: "var(--muted)" }}
        >
          Base Ecosystem Alerts — community-maintained event tracker. Not
          affiliated with Coinbase or Base.
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs font-semibold uppercase tracking-widest mb-5"
      style={{ color: "var(--muted)", fontFamily: "DM Sans, sans-serif" }}
    >
      {children}
    </h2>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-semibold text-base" style={{ color: "var(--text)" }}>
        {value}
      </span>
      {label}
    </span>
  );
}

function BaseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#0052FF" />
      <path
        d="M12.001 4.8C8.02 4.8 4.8 8.02 4.8 12c0 3.98 3.22 7.2 7.201 7.2 3.571 0 6.55-2.596 7.101-6h-4.5a2.7 2.7 0 1 1 0-2.4h4.5C18.55 7.396 15.572 4.8 12 4.8Z"
        fill="white"
      />
    </svg>
  );
}
