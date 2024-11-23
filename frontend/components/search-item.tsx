"use client";

import React from "react";
import Link from "next/link";
import { CircleDotDashed, Clipboard } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { Button } from "./ui/button";

export default function SearchItem({
  text,
  collection,
}: {
  text: string;
  collection: string;
}) {
  const { toast } = useToast();

  let type: string;
  switch (collection) {
    case "regex-collection":
      type = "regex";
      break;
    case "nlp-collection":
      type = "nlp";
      break;
    case "git-collection":
      type = "git";
      break;
    case "sql-collection":
      type = "sql";
      break;
    default:
      type = "Unknown";
  }

  const href = `/${type}?${type}=${text}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `Copied to clipboard`,
    });
  };

  return (
    <div className="flex w-full flex-col justify-between rounded-xl border-2 border-zinc-900 bg-zinc-800 p-2 focus-visible:ring-zinc-900">
      <p className="text-sm text-zinc-400">{text}</p>
      {type === "nlp" ? (
        <Button onClick={() => handleCopy()} className="mt-4 h-9 w-full">
          <Clipboard size={18} className="mr-2" />
          Copy
        </Button>
      ) : (
        <Link href={href} className="w-full">
          <Button className="mt-4 h-9 w-full">
            <CircleDotDashed size={18} className="mr-2" />
            Try
          </Button>
        </Link>
      )}
    </div>
  );
}
