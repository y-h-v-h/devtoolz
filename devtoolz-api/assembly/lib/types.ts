import { collections } from "@hypermode/modus-sdk-as";

// NATURAL LANGUAGE
@json
export class NaturalLanguageToRegexResult {

  @alias("regex")
  regex!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult: collections.CollectionMutationResult | null =
    null;


  @alias("regex-collection-mutation-result")
  regexCollectionMutationResult: collections.CollectionMutationResult | null =
    null;
}


@json
export class RegexToNaturalLanguageResult {

  @alias("naturalLanguage")
  naturalLanguage!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult: collections.CollectionMutationResult | null =
    null;


  @alias("regex-collection-mutation-result")
  regexCollectionMutationResult: collections.CollectionMutationResult | null =
    null;
}

// GIT
export class NaturalLanguageToGitCommandResult {

  @alias("gitCommand")
  gitCommand!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult: collections.CollectionMutationResult | null =
    null;


  @alias("git-command-collection-mutation-result")
  gitCommandCollectionMutationResult: collections.CollectionMutationResult | null =
    null;
}


@json
export class GitCommandToNaturalLanguageResult {

  @alias("naturalLanguage")
  naturalLanguage!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult: collections.CollectionMutationResult | null =
    null;


  @alias("git-command-collection-mutation-result")
  gitCommandCollectionMutationResult: collections.CollectionMutationResult | null =
    null;
}

// SQL
@json
export class NaturalLanguageToSQLQueryResult {

  @alias("sqlQuery")
  sqlQuery!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult: collections.CollectionMutationResult | null =
    null;


  @alias("sql-query-collection-mutation-result")
  sqlQueryCollectionMutationResult: collections.CollectionMutationResult | null =
    null;
}


@json
export class SQLQueryToNaturalLanguageResult {

  @alias("naturalLanguage")
  naturalLanguage!: string;


  @alias("natural-language-collection-mutation-result")
  naturalLanguageCollectionMutationResult: collections.CollectionMutationResult | null =
    null;


  @alias("sql-query-collection-mutation-result")
  sqlQueryCollectionMutationResult: collections.CollectionMutationResult | null =
    null;
}
