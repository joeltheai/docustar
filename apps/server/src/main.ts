import { createServer } from "node:http"
import { HttpRouter } from "effect/unstable/http"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { ApiLive } from "./documents.js"

const port = Number(process.env.PORT ?? 3001)

const ServerLive = HttpRouter.serve(ApiLive).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port })),
)

Layer.launch(ServerLive).pipe(NodeRuntime.runMain)
