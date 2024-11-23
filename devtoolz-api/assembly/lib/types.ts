import { collections } from "@hypermode/modus-sdk-as";


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
