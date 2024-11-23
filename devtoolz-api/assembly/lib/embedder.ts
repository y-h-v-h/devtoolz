import { models } from "@hypermode/modus-sdk-as";

import { SECOND_EMBEDDING_MODEL_NAME } from "./constants";

import { EmbeddingsModel } from "@hypermode/modus-sdk-as/models/experimental/embeddings";

export function defaultEmbedder(texts: string[]): f32[][] {
  const model = models.getModel<EmbeddingsModel>(SECOND_EMBEDDING_MODEL_NAME);
  const input = model.createInput(texts);
  const output = model.invoke(input);
  return output.predictions;
}
