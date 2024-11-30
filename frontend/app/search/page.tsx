"use client";

import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Loader, Search } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import SearchItem from "@/components/search-item";

type SearchItemType = {
  distance: number;
  key: string;
  labels: [];
  namespace: string;
  score: number;
  text: string;
};

export default function SearchPage() {
  const { toast } = useToast();
  const [collection, setCollection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const searchQuery = gql`
    query Search($text: String!, $collection: String!, $maxItems: Int!) {
      search(text: $text, collection: $collection, maxItems: $maxItems) {
        collection
        status
        error
        searchMethod
        objects {
          namespace
          key
          text
          labels
          distance
          score
        }
      }
    }
  `;

  const [search, { loading, error, data: searchData }] = useLazyQuery(
    searchQuery,
    {
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYPERMODE_API_KEY}`,
        },
      },
      skipPollAttempt: () => true,
      variables: {
        text: searchTerm,
        collection: collection,
        maxItems: 10,
      },
      onCompleted: (data) => {
        console.log("Search results", data);
        console.log("Search error", error);
        if (data.search.status !== "success") {
          toast({
            variant: "destructive",
            title: "Error",
            description: `${data.search.error}`,
          });
        }
      },
    }
  );

  const handleSearch = async () => {
    if (searchTerm.trim().length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Search field cannot be empty",
      });
      return;
    } else if (collection.trim().length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a search type",
      });
    } else {
      await search();
    }
  };

  return (
    <section className="flex min-h-screen w-full flex-col items-stretch lg:flex-row">
      <section className="lg:pb- pb- flex min-w-0 flex-1 flex-col gap-8 border-r border-dashed border-r-zinc-800 bg-[#18181b] px-6 pt-10 lg:px-12">
        <Header />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className={`mx-auto flex w-full max-w-4xl flex-col`}>
            <div className="flex flex-col">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-4 h-14 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
                placeholder={"What are you looking for?"}
              />
            </div>
            <div className="flex items-end justify-between">
              <div className="mr-10 mt-10">
                <Label className="mb-1 text-sm text-zinc-500">
                  Search type
                </Label>
                <Select
                  onValueChange={(collection) => setCollection(collection)}
                >
                  <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
                    <SelectItem
                      value="nlp-collection"
                      className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                    >
                      Natural Language
                    </SelectItem>
                    <SelectItem
                      value="bash-collection"
                      className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                    >
                      Bash Command
                    </SelectItem>
                    <SelectItem
                      value="regex-collection"
                      className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                    >
                      Regex
                    </SelectItem>
                    <SelectItem
                      value="git-collection"
                      className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                    >
                      Git Command
                    </SelectItem>
                    <SelectItem
                      value="sql-collection"
                      className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                    >
                      SQL Query
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mx-auto w-full max-w-4xl">
                <Button
                  type="button"
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="mr-5 h-9 w-full bg-brand text-black hover:bg-[#f8633b]"
                >
                  {loading ? (
                    <Loader size={18} className="mr-2 animate-spin" />
                  ) : (
                    <Search size={18} className="mr-2" />
                  )}
                  {loading ? "Searching..." : "Search?"}
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="mx-auto my-14 w-full max-w-4xl">
          <h4 className="mb-5 flex items-center text-lg text-zinc-500">
            <span className="mr-2">Search results</span>
          </h4>
          {!loading &&
          searchData &&
          searchData.search &&
          searchData.search.objects.length > 0 ? (
            <div className="grid flex-col gap-5 sm:grid-cols-2">
              {searchData.search.objects.map(
                (item: SearchItemType, i: number) => (
                  <SearchItem
                    key={i}
                    text={item.text}
                    collection={collection}
                  />
                )
              )}
            </div>
          ) : (
            <div className="flex h-96 w-full items-center justify-center">
              <p className="text-zinc-500">No results found</p>
            </div>
          )}
        </div>
      </section>

      {/* second section */}
      {/* <section className="relative shrink-0 overflow-hidden px-6 pb-10 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]"></section> */}
    </section>
  );
}
