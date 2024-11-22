"use client";

import { useState } from "react";
import Link from "next/link";
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
import Header from "@/components/header";
import Logo from "@/components/logo";
import Nav from "@/components/nav";
import SearchItem from "@/components/search-item";

export default function SearchPage() {
  return (
    <section className="flex min-h-screen w-full flex-col items-stretch lg:flex-row">
      <section className="lg:pb- pb- flex min-w-0 flex-1 flex-col gap-8 border-r border-dashed border-r-zinc-800 bg-[#18181b] px-6 pt-10 lg:px-12">
        <Header />

        <div className={`mx-auto flex w-full max-w-4xl flex-col`}>
          <div className="flex flex-col">
            <Input
              className="mt-4 h-14 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
              placeholder={"What are you looking for?"}
            />
          </div>
          <div className="flex items-end justify-between">
            <div className="mr-10 mt-10">
              <Label className="mb-1 text-sm text-zinc-500">Search type</Label>
              <Select>
                <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
                  <SelectItem
                    value="natural-language"
                    className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                  >
                    Natural Language
                  </SelectItem>
                  <SelectItem
                    value="git-command"
                    className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                  >
                    Git Command
                  </SelectItem>
                  <SelectItem
                    value="regex"
                    className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                  >
                    Regex
                  </SelectItem>
                  <SelectItem
                    value="sql-query"
                    className="hover:bg-brand hover:text-black focus:bg-brand focus:text-black"
                  >
                    SQL Query
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mx-auto w-full max-w-4xl">
              <Button className="mr-5 h-9 w-full bg-brand text-black hover:bg-[#f8633b]">
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 w-full max-w-4xl">
          <h4 className="mb-5 flex items-center text-lg text-zinc-500">
            <span className="mr-2">Search results</span>
            <span>(10)</span>
          </h4>
          <div className="grid grid-cols-3 flex-col gap-5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <SearchItem key={i} />
              ))}
          </div>
        </div>
      </section>

      {/* second section */}
      <section className="relative shrink-0 overflow-hidden px-6 pb-10 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]"></section>
    </section>
  );
}
