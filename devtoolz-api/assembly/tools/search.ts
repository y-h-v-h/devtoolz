import { collections } from "@hypermode/modus-sdk-as";
import { DEFAULT_SEARCH_METHOD } from "../lib/constants";

export function search(
  text: string,
  collection: string,
  maxItems: i32,
): collections.CollectionSearchResult {
  const response = collections.search(
    collection, // collection name declared in the application manifest
    DEFAULT_SEARCH_METHOD, // search method declared for this collection in the manifest
    text, // text to search for
    maxItems,
    true,
  );
  return response;
}
