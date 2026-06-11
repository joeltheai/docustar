import { DocustarApi } from "@docustar/domain"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { Effect, Layer } from "effect"
import { documents } from "./store.js"

export const DocumentsLive = HttpApiBuilder.group(
  DocustarApi,
  "documents",
  (handlers) =>
    handlers
      .handle("list", () => Effect.succeed(documents))
      .handle("get", ({ params }) => {
        const doc = documents.find((d) => d.id === params.id)
        return doc
          ? Effect.succeed(doc)
          : Effect.fail(new Error(`Document not found: ${params.id}`))
      }),
)

export const ApiLive = HttpApiBuilder.layer(DocustarApi).pipe(
  Layer.provide(DocumentsLive),
)
