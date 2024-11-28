"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gql, useLazyQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleDotDashed, Clipboard, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  naturalLanguageToRegexInstruction,
  regexToNaturalLanguageInstruction,
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
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header";
import Settings from "@/components/settings";

const FormSchema = z.object({
  naturalLanguage: z.string().optional(),
  regex: z.string().optional(),
});

export default function Regex() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [reordered, setReordered] = useState(false); // natural -> regex (true), meaning not reordered
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [regex, setRegex] = useState("");
  const [copied, setCopied] = useState(false);
  const [existsInCollection, setExistsInCollection] = useState(false);

  // used to check if the user was navigated from the /search route (has parameters)
  // If so, the regex is already in the Modus Collection and need
  // not be added again, to prevent duplicate items in collection
  let regexInParams: string | null;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      naturalLanguage: naturalLanguage,
      regex: regex,
    },
  });

  useEffect(() => {
    regexInParams = searchParams.get("regex");
    if (regexInParams == null) {
      return;
    } else {
      setReordered(true);
      setRegex(regexInParams);
      setExistsInCollection(true);
      form.setValue("regex", regexInParams);
      setNaturalLanguage("");
    }
  }, []);

  const handleCopy = async (type: string) => {
    const naturalLanguageText = form.getValues("naturalLanguage");
    const regexText = form.getValues("regex");
    const text = type === "naturalLanguage" ? naturalLanguageText : regexText;
    await navigator.clipboard.writeText(text || "").then(() => {
      toast({
        title: "Copied",
        description: `${type == "naturalLanguage" ? "Natural language" : "Regex"} copied to clipboard`,
      });
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };
  const naturalLanguageToRegexQuery = gql`
    query ConvertNaturalLanguageToRegex(
      $instruction: String!
      $naturalLanguage: String!
    ) {
      convertNaturalLanguageToRegex(
        instruction: $instruction
        naturalLanguage: $naturalLanguage
      ) {
        regex
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        regexCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const regexToNaturalLanguageQuery = gql`
    query ConvertRegexToNaturalLanguage(
      $instruction: String!
      $regex: String!
      $regexIsInCollection: Boolean!
    ) {
      convertRegexToNaturalLanguage(
        instruction: $instruction
        regex: $regex
        regexIsInCollection: $regexIsInCollection
      ) {
        naturalLanguage
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        regexCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const [convertNaturalLanguageToRegex, { loading, error, data }] =
    useLazyQuery(naturalLanguageToRegexQuery, {
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYPERMODE_API_KEY}`,
        },
      },
      skipPollAttempt: () => reordered, // if any weird behavior, try removing this
      variables: {
        instruction: naturalLanguageToRegexInstruction,
        naturalLanguage: naturalLanguage || "",
      },

      onCompleted: (data) => {
        console.log("Data on fetch (nlp to regex): ", data);
        console.log("Error on fetch (nlp to regex): ", error);
        form.setValue("regex", data.convertNaturalLanguageToRegex.regex);
      },
    });

  const [
    convertRegexToNaturalLanguage,
    { loading: regexLoading, error: regexError, data: regexData },
  ] = useLazyQuery(regexToNaturalLanguageQuery, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYPERMODE_API_KEY}`,
      },
    },
    skipPollAttempt: () => !reordered,
    variables: {
      instruction: regexToNaturalLanguageInstruction,
      regex: regex || "",
      regexIsInCollection: existsInCollection,
    },
    onCompleted: (data) => {
      console.log("Data on fetch (regex to nlp): ", data);
      console.log("Error on fetch (regex to nlp): ", regexError);
      form.setValue(
        "naturalLanguage",
        data.convertRegexToNaturalLanguage.naturalLanguage
      );
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (reordered) {
      console.log("Converting regex to natural language");
      setRegex(formData.regex || "");
      form.setValue("naturalLanguage", "");
      await convertRegexToNaturalLanguage();
    } else {
      console.log("Converting natural language to regex");
      setNaturalLanguage(formData.naturalLanguage || "");
      form.setValue("regex", "");
      await convertNaturalLanguageToRegex();
    }
  }

  // trim user input before sending

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
                        placeholder={`${reordered ? "Converted regex code in natural language" : "What you do you want to convert to regex?"}`}
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
                name="regex"
                render={({ field }) => (
                  <FormItem className="group relative flex flex-col">
                    <Button
                      type="button"
                      onClick={() => handleCopy("regex")}
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
                    <FormLabel className="text-sm">Regex</FormLabel>
                    <FormControl className="">
                      <Textarea
                        disabled={!reordered || loading}
                        className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900 disabled:opacity-100"
                        placeholder={`${reordered ? "Your regex code here" : "Output regex"}`}
                        rows={5}
                        cols={10}
                        {...field}
                      />
                    </FormControl>
                    {!reordered ? (
                      <FormDescription className="text-center">
                        NB: Verify regex code before using
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
                  disabled={regexLoading}
                  className="mr-5 h-9 w-full bg-brand text-black hover:bg-[#f8633b]"
                >
                  {regexLoading ? (
                    <Loader size={18} className="mr-2 animate-spin" />
                  ) : (
                    <CircleDotDashed size={18} className="mr-2" />
                  )}
                  {regexLoading
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
                  {loading ? "Converting..." : "Convert to regex"}
                </Button>
              )}
            </div>
          </form>
        </section>
        {/* <section className="relative my-20 shrink-0 overflow-hidden px-6 pb-10 lg:my-0 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]"></section> */}
      </section>
    </Form>
  );
}
