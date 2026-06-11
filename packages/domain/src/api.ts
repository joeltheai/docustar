import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/unstable/httpapi"
import { Schema } from "effect"
import { Document, DocumentId } from "./schemas.js"

export const DocustarApi = HttpApi.make("DocustarApi").add(
  HttpApiGroup.make("documents").add(
    HttpApiEndpoint.get("list", "/documents", {
      success: Schema.Array(Document),
    }),
    HttpApiEndpoint.get("get", "/documents/:id", {
      params: { id: DocumentId },
      success: Document,
    }),
  ),
)
