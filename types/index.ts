export type EventCategory = "community" | "conference" | "campaign" | "grant";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  url: string;
  lumaEventId?: string;
}

export interface Subscriber {
  email: string;
  walletAddress?: string;
  basename?: string;
  subscribedAt: string;
  categories: EventCategory[];
}
