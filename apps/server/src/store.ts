import type { Document } from "@docustar/domain"

/** In-memory store — replace with persistence + real-time sync later */
export const documents: Document[] = [
  {
    id: "1",
    title: "Welcome to Docustar",
    content: "Multiple users will edit here. WebSockets come next.",
  },
]
