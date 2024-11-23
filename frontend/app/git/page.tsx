"use client";

import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleDotDashed, Clipboard, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  gitCommandToNaturalLanguageInstruction,
  naturalLanguageToGitCommandInstruction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header";
import Settings from "@/components/settings";

const FormSchema = z.object({
  naturalLanguage: z.string().optional(),
  gitCommand: z.string().optional(),
});

export default function Git() {
  const { toast } = useToast();
  const [reordered, setReordered] = useState(false); // natural -> regex (true), meaning not reordered
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [gitCommand, setGitCommand] = useState("");
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      naturalLanguage: naturalLanguage,
      gitCommand: gitCommand,
    },
  });

  const handleCopy = async (type: string) => {
    const naturalLanguageText = form.getValues("naturalLanguage");
    const gitCommandText = form.getValues("gitCommand");
    const text =
      type === "naturalLanguage" ? naturalLanguageText : gitCommandText;
    await navigator.clipboard.writeText(text || "").then(() => {
      toast({
        title: "Copied",
        description: `${type == "naturalLanguage" ? "Natural language" : "Git command"} copied to clipboard`,
      });
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  const naturalLanguageToGitCommandQuery = gql`
    query ConvertNaturalLanguageToGitCommand(
      $instruction: String!
      $naturalLanguage: String!
    ) {
      convertNaturalLanguageToGitCommand(
        instruction: $instruction
        naturalLanguage: $naturalLanguage
      ) {
        gitCommand
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        gitCommandCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const gitCommandToNaturalLanguageQuery = gql`
    query ConvertGitCommandToNaturalLanguage(
      $instruction: String!
      $gitCommand: String!
    ) {
      convertGitCommandToNaturalLanguage(
        instruction: $instruction
        gitCommand: $gitCommand
      ) {
        naturalLanguage
        naturalLanguageCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
        gitCommandCollectionMutationResult {
          collection
          status
          error
          operation
          keys
        }
      }
    }
  `;

  const [convertNaturalLanguageToGitCommand, { loading, data }] = useLazyQuery(
    naturalLanguageToGitCommandQuery,
    {
      skipPollAttempt: () => reordered, // if any weird behavior, try removing this
      variables: {
        instruction: naturalLanguageToGitCommandInstruction,
        naturalLanguage: naturalLanguage || "",
      },

      onCompleted: (data) => {
        console.log("Data on fetch (nlp to git command): ", data);
        form.setValue(
          "gitCommand",
          data.convertNaturalLanguageToGitCommand.gitCommand
        );
      },
    }
  );

  const [
    convertGitCommandToNaturalLanguage,
    { loading: gitCommandLoading, data: gitCommandResult },
  ] = useLazyQuery(gitCommandToNaturalLanguageQuery, {
    skipPollAttempt: () => !reordered,
    variables: {
      instruction: gitCommandToNaturalLanguageInstruction,
      gitCommand: gitCommand || "",
    },
    onCompleted: (data) => {
      console.log("Data on fetch (git command to nlp): ", data);
      form.setValue(
        "naturalLanguage",
        data.convertGitCommandToNaturalLanguage.naturalLanguage
      );
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (reordered) {
      console.log("Converting git command to natural language");
      setGitCommand(formData.gitCommand || "");
      form.setValue("naturalLanguage", "");
      await convertGitCommandToNaturalLanguage();
    } else {
      console.log("Converting natural language to git command");
      setNaturalLanguage(formData.naturalLanguage || "");
      form.setValue("gitCommand", "");
      await convertNaturalLanguageToGitCommand();
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
                        placeholder={`${reordered ? "Converted git command in natural language" : "What you do you want to convert to a git command?"}`}
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
                name="gitCommand"
                render={({ field }) => (
                  <FormItem className="group relative flex flex-col">
                    <Button
                      type="button"
                      onClick={() => handleCopy("gitCommand")}
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
                    <FormLabel className="text-sm">Git command</FormLabel>
                    <FormControl className="">
                      <Textarea
                        disabled={!reordered || loading}
                        className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900 disabled:opacity-100"
                        placeholder={`${reordered ? "Your git command here" : "Output git command"}`}
                        rows={5}
                        cols={10}
                        {...field}
                      />
                    </FormControl>
                    {!reordered ? (
                      <FormDescription className="text-center">
                        NB: Verify git commands before using in production
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
                  disabled={gitCommandLoading}
                  className="mr-5 h-9 w-full bg-brand text-black hover:bg-[#f8633b]"
                >
                  {gitCommandLoading ? (
                    <Loader size={18} className="mr-2 animate-spin" />
                  ) : (
                    <CircleDotDashed size={18} className="mr-2" />
                  )}
                  {gitCommandLoading
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
                  {loading ? "Converting..." : "Convert to git command"}
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* second section */}
        <section className="relative shrink-0 overflow-hidden px-6 pb-10 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]">
          <h3 className="text-lg">Explanation</h3>
          <p className="py-2 text-sm leading-8 text-zinc-500">
            17 years together no way Seymour is missing out on some oven fried
            Catfish. He will stay with the food start to finish. He’s in kitchen
            right now watching it cook. The first of many he is very
            sophisticated.
          </p>
        </section>
      </section>
    </Form>
  );
}
