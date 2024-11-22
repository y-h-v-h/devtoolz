"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ArrowUpDown, CircleDotDashed, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import Logo from "@/components/logo";
import Nav from "@/components/nav";
import Settings from "@/components/settings";

export default function Git() {
  const user = useQuery(api.user.viewer);
  const { signIn } = useAuthActions();
  const [reordered, setReordered] = useState(false);

  return (
    <section className="flex min-h-screen w-full flex-col items-stretch lg:flex-row">
      <section className="lg:pb- pb- flex min-w-0 flex-1 flex-col gap-8 border-r border-dashed border-r-zinc-800 bg-[#18181b] px-6 pt-10 lg:px-12">
        <Header />

        <div
          className={`mx-auto flex w-full max-w-4xl flex-col ${reordered ? "flex-col-reverse" : ""}`}
        >
          <div className="flex flex-col">
            <Label className="text-sm">Naturual Language</Label>
            <Textarea
              className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
              placeholder={`${reordered ? "Converted git command in natural language" : "What you do you want to convert to a git command?"}`}
              rows={5}
              cols={10}
            />
          </div>

          <Settings reordered={reordered} setReordered={setReordered} />

          <div className="flex flex-col">
            <Label className="text-sm">Git command</Label>
            <Textarea
              className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
              placeholder={`${reordered ? "Your git command" : "Git command"}`}
              rows={5}
              cols={10}
            />
          </div>
        </div>
        <div className="mx-auto w-full max-w-4xl">
          <Button className="bg-brand mr-5 h-9 w-full text-black hover:bg-[#f8633b]">
            <CircleDotDashed size={18} className="mr-2" />
            Generate
          </Button>
        </div>
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
  );
}
