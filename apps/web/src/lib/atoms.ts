import * as Atom from "effect/unstable/reactivity/Atom"
import { Effect } from "effect"
import { makeApiClient } from "./api-client.js"

/** Fetches documents via the shared HttpApi client */
export const documentsAtom = Atom.make(
  Effect.gen(function* () {
    const client = yield* makeApiClient
    return yield* client.documents.list()
  }),
).pipe(Atom.keepAlive)
