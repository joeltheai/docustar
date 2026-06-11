import { useAtomValue } from "@effect/atom-react"
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import { createFileRoute } from "@tanstack/react-router"
import { documentsAtom } from "../lib/atoms.js"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const result = useAtomValue(documentsAtom)

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 640 }}>
      <h1>Docustar</h1>
      <p style={{ color: "#666" }}>
        Effect v4 backend + TanStack Router frontend. Shared types via{" "}
        <code>@docustar/domain</code>.
      </p>

      {AsyncResult.match(result, {
        onInitial: () => <p>Loading documents…</p>,
        onSuccess: ({ value: docs }) => (
          <ul>
            {docs.map((doc) => (
              <li key={doc.id}>
                <strong>{doc.title}</strong>
                <p>{doc.content}</p>
              </li>
            ))}
          </ul>
        ),
        onFailure: (failure) => <p>Error: {String(failure.cause)}</p>,
      })}
    </main>
  )
}
