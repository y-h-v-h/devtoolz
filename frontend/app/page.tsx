"use client";

import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ArrowUpDown, Key } from "lucide-react";

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

export default function Home() {
  const user = useQuery(api.user.viewer);
  const { signIn } = useAuthActions();
  return (
    // <section className="mx-auto grid min-h-screen max-w-3xl place-content-center text-center">
    //   <h1 className="inline-block bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-400 bg-clip-text text-6xl font-bold text-transparent">
    //     Simple tools for developers
    //   </h1>
    //   <div className="mt-10">
    //     <Button>Use for free</Button>
    //   </div>
    // </section>
    <section className="relative">
      {/* <div className="fixed -left-96 bottom-9 w-full">
        <div className="mx-auto max-w-md">
          <Nav />
        </div>
      </div> */}
      <section className="flex min-h-screen w-full flex-col items-stretch lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col gap-8 border-r border-dashed border-r-zinc-800 bg-[#18181b] px-6 pb-20 pt-14 lg:px-12 lg:pb-32">
          <div className="flex items-center justify-between">
            <Logo />
            <ul className="flex text-sm">
              <Link href={"/signin"}>
                <Button className="bg-brand h-9 text-black hover:bg-[#f8633b]">
                  <Key size={18} className="mr-2" />
                  Log in
                </Button>
              </Link>
            </ul>
          </div>
          <div className="mx-auto w-full max-w-4xl">
            <div className="flex flex-col">
              <Label className="text-sm">Regex</Label>
              <Textarea
                className="mt-4 h-60 max-h-60 min-h-60 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
                placeholder="Type your message here."
                rows={5}
                cols={10}
              />
            </div>

            <div className="mx-auto flex w-full items-center">
              <Button className="bg-brand my-10 mr-5 h-9 text-black hover:bg-[#f8633b]">
                <ArrowUpDown size={18} className="mr-2" />
                Reorder
              </Button>
              <Select>
                <SelectTrigger className="w-[180px] border-2 border-zinc-800">
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

            <div className="flex flex-col">
              <Label className="text-sm">Naturual Language</Label>
              <Textarea
                className="mt-4 h-60 max-h-60 min-h-60 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
                placeholder="Type your message here."
                rows={5}
                cols={10}
              />
            </div>
          </div>
        </section>
        <section className="relative shrink-0 px-6 pb-10 lg:w-[400px] lg:min-w-[400px] lg:px-12 lg:py-14 xl:w-[500px]"></section>
      </section>
    </section>
  );
}
