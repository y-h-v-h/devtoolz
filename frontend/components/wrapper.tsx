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
import Logo from "@/components/logo";
import Nav from "@/components/nav";

export default function Wrapper() {
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
              <Label className="text-sm">Naturual Language</Label>
              <Textarea
                className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
                placeholder={`${reordered ? "Converted SQL query in natural language" : "What you do you want to convert to an SQL Query?"}`}
                rows={5}
                cols={10}
              />
            </div>

            <div className="mx-auto my-10 flex w-full items-center">
              <div className="flex flex-col">
                <Label className="mb-5 text-sm text-zinc-500"></Label>
                <Button
                  onClick={() => setReordered(!reordered)}
                  className="mr-5 h-9 bg-zinc-800 hover:bg-[#111113]"
                >
                  <ArrowUpDown size={18} className="mr-2" />
                  Reorder
                </Button>
              </div>
              {!reordered ? null : (
                <>
                  <div className="">
                    <Label className="mb-1 text-sm text-zinc-500">
                      Language
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
                        <SelectItem
                          value="light"
                          className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                        >
                          Light
                        </SelectItem>
                        <SelectItem
                          value="dark"
                          className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                        >
                          Dark
                        </SelectItem>
                        <SelectItem
                          value="system"
                          className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                        >
                          System
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mx-4">
                    <Label className="mb-1 text-sm text-zinc-500">
                      Persona
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
                        <SelectItem
                          value="light"
                          className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                        >
                          Light
                        </SelectItem>
                        <SelectItem
                          value="dark"
                          className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                        >
                          Dark
                        </SelectItem>
                        <SelectItem
                          value="system"
                          className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                        >
                          System
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col">
              <Label className="text-sm">SQL Query</Label>
              <Textarea
                className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
                placeholder={`${reordered ? "Your SQL query here" : "Output in SQL"}`}
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
    </section>
  );
}
