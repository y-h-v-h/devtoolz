"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import {
  ArrowUpDown,
  CircleDotDashed,
  Key,
  Search,
  SearchCheck,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/logo";
import Nav from "@/components/nav";

export default function SearchPage() {
  const user = useQuery(api.user.viewer);
  const { signIn } = useAuthActions();
  const [reordered, setReordered] = useState(false);

  return (
    <section className="relative">
      <section className="flex min-h-screen w-full flex-col items-stretch lg:flex-row">
        <section className="lg:pb- pb- flex min-w-0 flex-1 flex-col gap-8 border-r border-dashed border-r-zinc-800 bg-[#18181b] px-6 pt-10 lg:px-12">
          <div className="mb-12 flex items-center justify-between">
            <Logo />
            <div className="w-full">
              <div className="mx-auto max-w-md">
                <Nav />
              </div>
            </div>
            <ul className="flex text-sm">
              <Link href={"/signin"}>
                {/* <Button className="bg-brand h-9 text-black hover:bg-[#f8633b]">
                  <Key size={18} className="mr-2" />
                  Log in
                </Button> */}
                <Button className="bgzin mr-5 h-9 bg-zinc-800 hover:bg-[#111113]">
                  <Key size={18} className="mr-2" />
                  Login
                </Button>
              </Link>
            </ul>
          </div>

          <div
            className={`mx-auto flex w-full max-w-4xl flex-col ${reordered ? "flex-col-reverse" : ""}`}
          >
            <div className="flex flex-col">
              <Input
                className="mt-4 h-14 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
                placeholder={`${reordered ? "Converted git command in natural language" : "What are you looking for?"}`}
              />
            </div>
            <div className="flex items-end justify-between">
              <div className="mr-10 mt-10">
                <Label className="mb-1 text-sm text-zinc-500">
                  Search type
                </Label>
                <Select>
                  <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
                    <SelectItem
                      value="natural-language"
                      className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                    >
                      Natural Language
                    </SelectItem>
                    <SelectItem
                      value="git-command"
                      className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                    >
                      Git Command
                    </SelectItem>
                    <SelectItem
                      value="regex"
                      className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                    >
                      Regex
                    </SelectItem>
                    <SelectItem
                      value="sql-query"
                      className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                    >
                      SQL Query
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mx-auto w-full max-w-4xl">
                <Button className="bg-brand mr-5 h-9 w-full text-black hover:bg-[#f8633b]">
                  <Search size={18} className="mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* second section */}
        <section className="relative shrink-0 overflow-hidden px-6 pb-10 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]"></section>
      </section>
    </section>
  );
}
