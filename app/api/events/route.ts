import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { Event } from "@/types";

export async function GET() {
  const filePath = path.join(process.cwd(), "data/events.json");
  const events: Event[] = JSON.parse(readFileSync(filePath, "utf-8"));

  const sorted = events.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return NextResponse.json(sorted);
}
