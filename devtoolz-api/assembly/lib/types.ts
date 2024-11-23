import { collections } from "@hypermode/modus-sdk-as";

// NATURAL LANGUAGE
@json
export class NaturalLanguageToRegexResult {

  @alias("regex")
  regex!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult!: collections.CollectionMutationResult;


  @alias("regex-collection-mutation-result")
  regexCollectionMutationResult!: collections.CollectionMutationResult;
}


@json
export class RegexToNaturalLanguageResult {

  @alias("naturalLanguage")
  naturalLanguage!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult!: collections.CollectionMutationResult;


  @alias("regex-collection-mutation-result")
  regexCollectionMutationResult!: collections.CollectionMutationResult;
}

// GIT
export class NaturalLanguageToGitCommandResult {

  @alias("gitCommand")
  gitCommand!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult!: collections.CollectionMutationResult;


  @alias("git-command-collection-mutation-result")
  gitCommandCollectionMutationResult!: collections.CollectionMutationResult;
}


@json
export class GitCommandToNaturalLanguageResult {

  @alias("naturalLanguage")
  naturalLanguage!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult!: collections.CollectionMutationResult;


  @alias("git-command-collection-mutation-result")
  gitCommandCollectionMutationResult!: collections.CollectionMutationResult;
}
