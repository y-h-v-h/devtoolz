"use client";

import { Suspense, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CircleDotDashed,
  Clipboard,
  Loader,
  Loader2,
} from "lucide-react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

import { naturalLanguageToRegexInstruction } from "@/lib/model-instructions";
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
  const { toast } = useToast();
  const [reordered, setReordered] = useState(false); // natural -> regex (true), meaning not reordered
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [regex, setRegex] = useState("");
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      naturalLanguage: naturalLanguage,
      regex: regex,
    },
  });

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
    query ConvertNaturalLanguageToRegex {
      convertNaturalLanguageToRegex(instruction: "${naturalLanguageToRegexInstruction}", naturalLanguage: "${naturalLanguage || ""}") {
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

  const [convertNatuaralLanguageToRegex, { loading, data }] = useLazyQuery(
    naturalLanguageToRegexQuery,
    {
      onCompleted: (data) => {
        console.log("Data on fetch: ", data);
        form.setValue("regex", data.convertNaturalLanguageToRegex.regex);
      },
    }
  );

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setNaturalLanguage(formData.naturalLanguage || "");
    form.setValue("regex", "");

    await convertNatuaralLanguageToRegex();
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
                    {!reordered && (
                      <FormDescription className="text-center">
                        NB: Verify regex code before using
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mx-auto mt-10 w-full max-w-4xl">
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
                {loading ? "Converting..." : "Convert"}
              </Button>
            </div>
          </form>
        </section>

        {/* second section */}
        <section className="relative mt-20 shrink-0 overflow-hidden px-6 pb-10 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]">
          <h3 className="text-lg">Explanation</h3>
          {/* can use dangerouslySetHTML here */}
          <p className="py-2 text-sm leading-8 text-zinc-500">
            17 years together no way Seymour is missing out on some oven fried
            Catfish. He will stay with the food start to finish. He&apos;s in
            kitchen right now watching it cook. The first of many he is very
            sophisticated. I'm trying to build a simple blog site and want a
            markdown editor. Which is the best markdown editor/library for
            react? preferably something with Code support. I have kept this one
            in mind, I was just looking if there was any other better library
            that I'm not aware about. Thanks for the suggestion!
          </p>
        </section>
      </section>
    </Form>
  );
}
