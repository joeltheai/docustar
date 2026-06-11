import { DocustarApi } from "@docustar/domain"
import { FetchHttpClient } from "effect/unstable/http"
import { HttpApiClient } from "effect/unstable/httpapi"
import { Effect } from "effect"

/** Typed API client — same `DocustarApi` definition as the server */
export const makeApiClient = Effect.gen(function* () {
  return yield* HttpApiClient.make(DocustarApi, {
    baseUrl: "/api",
  })
}).pipe(Effect.provide(FetchHttpClient.layer))
