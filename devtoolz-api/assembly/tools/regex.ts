import { models, collections } from "@hypermode/modus-sdk-as";

import {
  OpenAIChatModel,
  ResponseFormat,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";
import { EmbeddingsModel } from "@hypermode/modus-sdk-as/models/experimental/embeddings";

import {
  DEFAULT_EMBEDDING_MODEL_NAME,
  DEFAULT_MODEL_NAME,
  NATURAL_LANGUAGE_COLLECTION_NAME,
  REGEX_COLLECTION_NAME,
} from "../lib/constants";
import { NaturalLanguageToRegexResult } from "../lib/types";

export function convertNaturalLanguageToRegex(
  instruction: string,
  naturalLanguage: string,
): NaturalLanguageToRegexResult {
  const model = models.getModel<OpenAIChatModel>(DEFAULT_MODEL_NAME);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(
      `Convert this natural language to regex: ${naturalLanguage}.
      Do not add your own comments. Return only the regex -
      do not include any other comments, information, context, or explanation.
      Do not format it into html or anything, or wrap in quotes or a string. Just 
      return the regex.`,
    ),
  ]);

  input.temperature = 0.7;
  const output = model.invoke(input);

  // embed the natural language and regex into collection
  const naturalLanguageCollectionMutationResult = collections.upsert(
    NATURAL_LANGUAGE_COLLECTION_NAME, // Collection name defined in the manifest
    null, // using null to let Modus generate a unique ID
    naturalLanguage, // the text to store
    // no labels for this item
    // no namespace provided, use default namespace
  );

  const regexCollectionMutationResult = collections.upsert(
    REGEX_COLLECTION_NAME, // Collection name defined in the manifest
    null, // using null to let Modus generate a unique ID
    output.choices[0].message.content.trim(), // the text to store
    // no labels for this item
    // no namespace provided, use default namespace
  );

  return {
    regex: output.choices[0].message.content.trim(),
    naturalLanguageCollectionMutationResult:
      naturalLanguageCollectionMutationResult,
    regexCollectionMutationResult: regexCollectionMutationResult,
  };
}
