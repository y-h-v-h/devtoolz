"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gql, useLazyQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleDotDashed, Clipboard, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  naturalLanguageToSQLQueryInstruction,
  sqlQueryToNaturalLanguageInstruction,
} from "@/lib/model-instructions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header";
import Settings from "@/components/settings";

const FormSchema = z.object({
  naturalLanguage: z.string().optional(),
  sqlQuery: z.string().optional(),
});

export default function SQL() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [reordered, setReordered] = useState(false); // natural -> regex (true), meaning not reordered
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [sqlQuery, setSQLQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [existsInCollection, setExistsInCollection] = useState(false);

  // used to check if the user was navigated from the /search route (has parameters)
  // If so, the SQL query is already in the Modus Collection and need
  // not be added again, to prevent duplicate items in collection
  let sqlInParams: string | null;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      naturalLanguage: naturalLanguage,
      sqlQuery: sqlQuery,
    },
  });

  useEffect(() => {
    sqlInParams = searchParams.get("sql");
    if (sqlInParams == null) {
      return;
    } else {
      setReordered(true);
      setSQLQuery(sqlInParams);
      setExistsInCollection(true);
      form.setValue("sqlQuery", sqlInParams);
      setNaturalLanguage("");
    }
  }, []);

  const handleCopy = async (type: string) => {
    const naturalLanguageText = form.getValues("naturalLanguage");
    const sqlQueryText = form.getValues("sqlQuery");
    const text =
      type === "naturalLanguage" ? naturalLanguageText : sqlQueryText;
    await navigator.clipboard.writeText(text || "").then(() => {
      toast({
        title: "Copied",
        description: `${type == "naturalLanguage" ? "Natural language" : "SQL query"} copied to clipboard`,
      });
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  const naturalLanguageToSQLQuery = gql`
    query ConvertSQLQueryToNaturalLanguage(
      $instruction: String!
      $naturalLanguage: String!
    ) {
      convertNaturalLanguageToSQLQuery(
        instruction: $instruction
        naturalLanguage: $naturalLanguage
      ) {
        sqlQuery
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        sqlQueryCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const sqlToNaturalLanguageQuery = gql`
    query ConvertSQLQueryToNaturalLanguage(
      $instruction: String!
      $sqlQuery: String!
      $sqlQueryIsInCollection: Boolean!
    ) {
      convertSQLQueryToNaturalLanguage(
        instruction: $instruction
        sqlQuery: $sqlQuery
        sqlQueryIsInCollection: $sqlQueryIsInCollection
      ) {
        naturalLanguage
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        sqlQueryCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const [convertNaturalLanguageSQLQuery, { loading, data }] = useLazyQuery(
    naturalLanguageToSQLQuery,
    {
      skipPollAttempt: () => reordered, // if any weird behavior, try removing this
      variables: {
        instruction: naturalLanguageToSQLQueryInstruction,
        naturalLanguage: naturalLanguage || "",
      },

      onCompleted: (data) => {
        console.log("Data on fetch (nlp to git command): ", data);
        form.setValue(
          "sqlQuery",
          data.convertNaturalLanguageToSQLQuery.sqlQuery
        );
      },
    }
  );

  const [
    convertsqlQueryToNaturalLanguage,
    { loading: sqlQueryLoading, data: sqlQueryData },
  ] = useLazyQuery(sqlToNaturalLanguageQuery, {
    skipPollAttempt: () => !reordered,
    variables: {
      instruction: sqlQueryToNaturalLanguageInstruction,
      sqlQuery: sqlQuery || "",
      sqlQueryIsInCollection: existsInCollection,
    },
    onCompleted: (data) => {
      console.log("Data on fetch (git command to nlp): ", data);
      form.setValue(
        "naturalLanguage",
        data.convertSQLQueryToNaturalLanguage.naturalLanguage
      );
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (reordered) {
      console.log("Converting sql query to natural language");
      setSQLQuery(formData.sqlQuery || "");
      form.setValue("naturalLanguage", "");
      await convertsqlQueryToNaturalLanguage();
    } else {
      console.log("Converting natural language to sql query");
      setNaturalLanguage(formData.naturalLanguage || "");
      form.setValue("sqlQuery", "");
      await convertNaturalLanguageSQLQuery();
    }
  }

  return (
    <Form {...form}>
      <section className="flex min-h-screen w-full flex-col items-stretch lg:flex-row">
        <section className="lg:pb- pb- flex min-w-0 flex-1 flex-col gap-8 border-r border-dashed border-r-zinc-800 bg-[#18181b] px-6 pt-10 lg:px-12">
          <Header />
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div
              className={`mx-auto flex w-full max-w-4xl flex-col ${reordered ? "flex-col-reverse" : ""}`}
            >
              <FormField
                control={form.control}
                name="naturalLanguage"
                render={({ field }) => (
                  <FormItem className="group relative flex flex-col">
                    <Button
                      type="button"
                      onClick={() => handleCopy("naturalLanguage")}
                      variant={"ghost"}
                      size={"icon"}
                      className="group absolute right-5 top-14 transition-all duration-100 ease-linear hover:bg-[#18181b]"
                    >
                      {copied ? (
                        <Check
                          size={18}
                          className="opacity-0 group-hover:text-zinc-400 group-hover:opacity-90"
                        />
                      ) : (
                        <Clipboard
                          size={18}
                          className="opacity-0 group-hover:text-zinc-400 group-hover:opacity-90"
                        />
                      )}
                    </Button>
                    <FormLabel className="text-sm">Natural Language</FormLabel>
                    <FormControl className="">
                      <Textarea
                        disabled={reordered || loading}
                        className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900 disabled:opacity-100"
                        placeholder={`${reordered ? "Converted sql query in natural language" : "What you do you want to convert to an sql query?"}`}
                        rows={5}
                        cols={10}
                        {...field}
                      />
                    </FormControl>

                    {!reordered && (
                      <FormDescription className="text-center">
                        NB: If there are any quotes, use only single quotes
                      </FormDescription>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Settings reordered={reordered} setReordered={setReordered} />

              <FormField
                control={form.control}
                name="sqlQuery"
                render={({ field }) => (
                  <FormItem className="group relative flex flex-col">
                    <Button
                      type="button"
                      onClick={() => handleCopy("sqlQuery")}
                      variant={"ghost"}
                      size={"icon"}
                      className="group absolute right-5 top-14 transition-all duration-100 ease-linear hover:bg-[#18181b]"
                    >
                      {copied ? (
                        <Check
                          size={18}
                          className="opacity-0 group-hover:text-zinc-400 group-hover:opacity-90"
                        />
                      ) : (
                        <Clipboard
                          size={18}
                          className="opacity-0 group-hover:text-zinc-400 group-hover:opacity-90"
                        />
                      )}
                    </Button>
                    <FormLabel className="text-sm">SQL Query</FormLabel>
                    <FormControl className="">
                      <Textarea
                        disabled={!reordered || loading}
                        className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900 disabled:opacity-100"
                        placeholder={`${reordered ? "Your git sql query here" : "Output sql query"}`}
                        rows={5}
                        cols={10}
                        {...field}
                      />
                    </FormControl>
                    {!reordered ? (
                      <FormDescription className="text-center">
                        NB: Verify sql queries before using in production
                      </FormDescription>
                    ) : (
                      <FormDescription className="text-center">
                        NB: If there are any quotes, use only single quotes
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mx-auto mt-10 w-full max-w-4xl">
              {reordered ? (
                <Button
                  type="submit"
                  disabled={sqlQueryLoading}
                  className="mr-5 h-9 w-full bg-brand text-black hover:bg-[#f8633b]"
                >
                  {sqlQueryLoading ? (
                    <Loader size={18} className="mr-2 animate-spin" />
                  ) : (
                    <CircleDotDashed size={18} className="mr-2" />
                  )}
                  {sqlQueryLoading
                    ? "Converting..."
                    : "Convert to natural language"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="mr-5 h-9 w-full bg-brand text-black hover:bg-[#f8633b]"
                >
                  {loading ? (
                    <Loader size={18} className="mr-2 animate-spin" />
                  ) : (
                    <CircleDotDashed size={18} className="mr-2" />
                  )}
                  {loading ? "Converting..." : "Convert to sql query"}
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* second section */}
        {/* <section className="relative shrink-0 overflow-hidden px-6 pb-10 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]"></section> */}
      </section>
    </Form>
  );
}
