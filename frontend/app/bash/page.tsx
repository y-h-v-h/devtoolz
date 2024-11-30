"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gql, useLazyQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleDotDashed, Clipboard, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  bashToNaturalLanguageInstruction,
  naturalLanguageToBashInstruction,
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
  bashCommand: z.string().optional(),
});

export default function Bash() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [reordered, setReordered] = useState(false); // natural -> bash (true), meaning not reordered
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [bashCommand, setBashCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [existsInCollection, setExistsInCollection] = useState(false);

  // used to check if the user was navigated from the /search route (has parameters)
  // If so, the bash is already in the Modus Collection and need
  // not be added again, to prevent duplicate items in collection
  let bashInParams: string | null;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      naturalLanguage: naturalLanguage,
      bashCommand: bashCommand,
    },
  });

  useEffect(() => {
    bashInParams = searchParams.get("bash");
    if (bashInParams == null) {
      return;
    } else {
      setReordered(true);
      setBashCommand(bashInParams);
      setExistsInCollection(true);
      form.setValue("bashCommand", bashInParams);
      setNaturalLanguage("");
    }
  }, []);

  const handleCopy = async (type: string) => {
    const naturalLanguageText = form.getValues("naturalLanguage");
    const bashText = form.getValues("bashCommand");
    const text = type === "naturalLanguage" ? naturalLanguageText : bashText;
    await navigator.clipboard.writeText(text || "").then(() => {
      toast({
        title: "Copied",
        description: `${type == "naturalLanguage" ? "Natural language" : "Bash command"} copied to clipboard`,
      });
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };
  const naturalLanguageToBashQuery = gql`
    query ConvertNaturalLanguageToBashCommand(
      $instruction: String!
      $naturalLanguage: String!
    ) {
      convertNaturalLanguageToBashCommand(
        instruction: $instruction
        naturalLanguage: $naturalLanguage
      ) {
        bashCommand
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        bashCommandCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const bashCommandToNaturalLanguageQuery = gql`
    query ConvertBashCommandToNaturalLanguage(
      $instruction: String!
      $bashCommand: String!
      $bashCommandIsInCollection: Boolean!
    ) {
      convertBashCommandToNaturalLanguage(
        instruction: $instruction
        bashCommand: $bashCommand
        bashCommandIsInCollection: $bashCommandIsInCollection
      ) {
        naturalLanguage
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        bashCommandCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const [convertNaturalLanguageToBash, { loading, error, data }] = useLazyQuery(
    naturalLanguageToBashQuery,
    {
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYPERMODE_API_KEY}`,
        },
      },
      skipPollAttempt: () => reordered, // if any weird behavior, try removing this
      variables: {
        instruction: naturalLanguageToBashInstruction,
        naturalLanguage: naturalLanguage || "",
      },

      onCompleted: (data) => {
        console.log("Data on fetch (nlp to bash): ", data);
        console.log("Error on fetch (nlp to bash): ", error);
        form.setValue(
          "bashCommand",
          data.convertNaturalLanguageToBashCommand.bashCommand
        );
      },
    }
  );

  const [
    convertBashCommandToNaturalLanguage,
    { loading: bashLoading, error: bashError, data: bashData },
  ] = useLazyQuery(bashCommandToNaturalLanguageQuery, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYPERMODE_API_KEY}`,
      },
    },
    skipPollAttempt: () => !reordered,
    variables: {
      instruction: bashToNaturalLanguageInstruction,
      bashCommand: bashCommand || "",
      bashCommandIsInCollection: existsInCollection,
    },
    onCompleted: (data) => {
      console.log("Data on fetch (bash to nlp): ", data);
      console.log("Error on fetch (bash to nlp): ", bashError);
      form.setValue(
        "naturalLanguage",
        data.convertBashCommandToNaturalLanguage.naturalLanguage
      );
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (reordered) {
      console.log("Converting bash to natural language");
      setBashCommand(formData.bashCommand || "");
      form.setValue("naturalLanguage", "");
      await convertBashCommandToNaturalLanguage();
    } else {
      console.log("Converting natural language to bash");
      setNaturalLanguage(formData.naturalLanguage || "");
      form.setValue("bashCommand", "");
      await convertNaturalLanguageToBash();
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
                        placeholder={`${reordered ? "Converted bash command in natural language" : "What you do you want to convert to a bash command?"}`}
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
                name="bashCommand"
                render={({ field }) => (
                  <FormItem className="group relative flex flex-col">
                    <Button
                      type="button"
                      onClick={() => handleCopy("bashCommand")}
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
                    <FormLabel className="text-sm">Bash command</FormLabel>
                    <FormControl className="">
                      <Textarea
                        disabled={!reordered || loading}
                        className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900 disabled:opacity-100"
                        placeholder={`${reordered ? "Your bash command code here" : "Output bash command"}`}
                        rows={5}
                        cols={10}
                        {...field}
                      />
                    </FormControl>
                    {!reordered ? (
                      <FormDescription className="text-center">
                        NB: Verify bash commands before using in production
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
                  disabled={bashLoading}
                  className="mr-5 h-9 w-full bg-brand text-black hover:bg-[#f8633b]"
                >
                  {bashLoading ? (
                    <Loader size={18} className="mr-2 animate-spin" />
                  ) : (
                    <CircleDotDashed size={18} className="mr-2" />
                  )}
                  {bashLoading
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
                  {loading ? "Converting..." : "Convert to bash command"}
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
