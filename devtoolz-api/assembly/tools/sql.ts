import { models, collections } from "@hypermode/modus-sdk-as";

import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";

import {
  SECOND_MODEL_NAME,
  NATURAL_LANGUAGE_COLLECTION_NAME,
  SQL_QUERY_COLLECTION_NAME,
} from "../lib/constants";
import {
  NaturalLanguageToSQLQueryResult,
  SQLQueryToNaturalLanguageResult,
} from "../lib/types";

export function convertNaturalLanguageToSQLQuery(
  instruction: string,
  naturalLanguage: string,
): NaturalLanguageToSQLQueryResult {
  const model = models.getModel<OpenAIChatModel>(SECOND_MODEL_NAME);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(
      `Convert this natural language to an sql query: ${naturalLanguage}.
      Do not add your own comments. Return only the sql query -
      do not include any other comments, information, context, or explanation.
      Do not format it into html or anything, or wrap in quotes or a string. Just 
      return the sql query. If there are any quotes in the sql query, use single quotes
      instead of double quotes. `,
    ),
  ]);

  input.temperature = 0.7;
  const output = model.invoke(input);

  // embed the natural language and sql query into collection
  const naturalLanguageCollectionMutationResult = collections.upsert(
    NATURAL_LANGUAGE_COLLECTION_NAME,
    null,
    naturalLanguage,
  );

  const sqlQueryCollectionMutationResult = collections.upsert(
    SQL_QUERY_COLLECTION_NAME,
    null,
    output.choices[0].message.content.trim(),
  );

  return {
    sqlQuery: output.choices[0].message.content.trim(),
    naturalLanguageCollectionMutationResult:
      naturalLanguageCollectionMutationResult,
    sqlQueryCollectionMutationResult: sqlQueryCollectionMutationResult,
  };
}

export function convertSQLQueryToNaturalLanguage(
  instruction: string,
  sqlQuery: string,
  sqlQueryIsInCollection: bool,
): SQLQueryToNaturalLanguageResult {
  const model = models.getModel<OpenAIChatModel>(SECOND_MODEL_NAME);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(
      `Convert this SQL query to natural language: ${sqlQuery}.
      Do not add your own comments. Return only the natural language -
      do not include any other comments, information, context, or explanation.
      Do not format it into html or anything, or wrap in quotes or a string. Just 
      return the natural language. If there are any quotes in the natural language,
      use single quotes instead of double quotes.`,
    ),
  ]);

  input.temperature = 0.7;
  const output = model.invoke(input);

  if (sqlQueryIsInCollection) {
    return {
      naturalLanguage: output.choices[0].message.content.trim(),
      naturalLanguageCollectionMutationResult: null,
      sqlQueryCollectionMutationResult: null,
    };
  } else {
    const naturalLanguageCollectionMutationResult = collections.upsert(
      NATURAL_LANGUAGE_COLLECTION_NAME,
      null,
      output.choices[0].message.content.trim(),
    );

    const sqlQueryCollectionMutationResult = collections.upsert(
      SQL_QUERY_COLLECTION_NAME,
      null,
      sqlQuery,
    );

    return {
      naturalLanguage: output.choices[0].message.content.trim(),
      naturalLanguageCollectionMutationResult:
        naturalLanguageCollectionMutationResult,
      sqlQueryCollectionMutationResult: sqlQueryCollectionMutationResult,
    };
  }
}
