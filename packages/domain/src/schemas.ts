import { Schema } from "effect"

export const DocumentId = Schema.String

export const Document = Schema.Struct({
  id: DocumentId,
  title: Schema.String,
  content: Schema.String,
})

export type Document = typeof Document.Type
