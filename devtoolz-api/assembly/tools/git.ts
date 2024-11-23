import { models, collections } from "@hypermode/modus-sdk-as";

import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";

import {
  SECOND_MODEL_NAME,
  NATURAL_LANGUAGE_COLLECTION_NAME,
  GIT_COMMAND_COLLECTION_NAME,
} from "../lib/constants";
import {
  GitCommandToNaturalLanguageResult,
  NaturalLanguageToGitCommandResult,
} from "../lib/types";

export function convertNaturalLanguageToGitCommand(
  instruction: string,
  naturalLanguage: string,
): NaturalLanguageToGitCommandResult {
  const model = models.getModel<OpenAIChatModel>(SECOND_MODEL_NAME);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(
      `Convert this natural language to a git command: ${naturalLanguage}.
      Do not add your own comments. Return only the git command -
      do not include any other comments, information, context, or explanation.
      Do not format it into html or anything, or wrap in quotes or a string. Just 
      return the git command. If there are any quotes in the git command, use single quotes
      instead of double quotes. `,
    ),
  ]);

  input.temperature = 0.7;
  const output = model.invoke(input);

  // embed the natural language and git command into collection
  const naturalLanguageCollectionMutationResult = collections.upsert(
    NATURAL_LANGUAGE_COLLECTION_NAME,
    null,
    naturalLanguage,
  );

  const gitCommandCollectionMutationResult = collections.upsert(
    GIT_COMMAND_COLLECTION_NAME,
    null,
    output.choices[0].message.content.trim(),
  );

  return {
    gitCommand: output.choices[0].message.content.trim(),
    naturalLanguageCollectionMutationResult:
      naturalLanguageCollectionMutationResult,
    gitCommandCollectionMutationResult: gitCommandCollectionMutationResult,
  };
}

export function convertGitCommandToNaturalLanguage(
  instruction: string,
  gitCommand: string,
  gitCommandIsInCollection: bool,
): GitCommandToNaturalLanguageResult {
  const model = models.getModel<OpenAIChatModel>(SECOND_MODEL_NAME);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(
      `Convert this git command to natural language: ${gitCommand}.
      Do not add your own comments. Return only the natural language -
      do not include any other comments, information, context, or explanation.
      Do not format it into html or anything, or wrap in quotes or a string. Just 
      return the natural language. If there are any quotes in the natural language,
      use single quotes instead of double quotes.`,
    ),
  ]);

  input.temperature = 0.7;
  const output = model.invoke(input);

  if (gitCommandIsInCollection) {
    return {
      naturalLanguage: output.choices[0].message.content.trim(),
      naturalLanguageCollectionMutationResult: null,
      gitCommandCollectionMutationResult: null,
    };
  } else {
    const naturalLanguageCollectionMutationResult = collections.upsert(
      NATURAL_LANGUAGE_COLLECTION_NAME,
      null,
      output.choices[0].message.content.trim(),
    );

    const gitCommandCollectionMutationResult = collections.upsert(
      GIT_COMMAND_COLLECTION_NAME,
      null,
      gitCommand,
    );

    return {
      naturalLanguage: output.choices[0].message.content.trim(),
      naturalLanguageCollectionMutationResult:
        naturalLanguageCollectionMutationResult,
      gitCommandCollectionMutationResult: gitCommandCollectionMutationResult,
    };
  }
}
