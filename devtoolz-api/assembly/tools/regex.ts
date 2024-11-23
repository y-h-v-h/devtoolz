import { models, collections } from "@hypermode/modus-sdk-as";

import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";

import {
  SECOND_MODEL_NAME,
  NATURAL_LANGUAGE_COLLECTION_NAME,
  REGEX_COLLECTION_NAME,
} from "../lib/constants";
import {
  NaturalLanguageToRegexResult,
  RegexToNaturalLanguageResult,
} from "../lib/types";

export function convertNaturalLanguageToRegex(
  instruction: string,
  naturalLanguage: string,
): NaturalLanguageToRegexResult {
  const model = models.getModel<OpenAIChatModel>(SECOND_MODEL_NAME);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(
      `Convert this natural language to regex: ${naturalLanguage}.
      Do not add your own comments. Return only the regex -
      do not include any other comments, information, context, or explanation.
      Do not format it into html or anything, or wrap in quotes or a string. Just 
      return the regex. If there are any quotes in the regex, use single quotes
      instead of double quotes. `,
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

export function convertRegexToNaturalLanguage(
  instruction: string,
  regex: string,
  regexIsInCollection: bool,
): RegexToNaturalLanguageResult {
  const model = models.getModel<OpenAIChatModel>(SECOND_MODEL_NAME);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(
      `Convert this regex to natural language: ${regex}.
      Do not add your own comments. Return only the natural language -
      do not include any other comments, information, context, or explanation.
      Do not format it into html or anything, or wrap in quotes or a string. Just 
      return the natural language. If there are any quotes in the natural language,
      use single quotes instead of double quotes.`,
    ),
  ]);

  input.temperature = 0.7;
  const output = model.invoke(input);

  if (regexIsInCollection) {
    return {
      naturalLanguage: output.choices[0].message.content.trim(),
      naturalLanguageCollectionMutationResult: null,
      regexCollectionMutationResult: null,
    };
  } else {
    const naturalLanguageCollectionMutationResult = collections.upsert(
      NATURAL_LANGUAGE_COLLECTION_NAME,
      null,
      output.choices[0].message.content.trim(),
    );

    const regexCollectionMutationResult = collections.upsert(
      REGEX_COLLECTION_NAME,
      null,
      regex,
    );

    return {
      naturalLanguage: output.choices[0].message.content.trim(),
      naturalLanguageCollectionMutationResult:
        naturalLanguageCollectionMutationResult,
      regexCollectionMutationResult: regexCollectionMutationResult,
    };
  }
}
