"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "./ui/button";

const links = [
  {
    name: "Regex",
    href: "/regex",
  },
  {
    name: "Git",
    href: "/git",
  },

  {
    name: "SQL",
    href: "/sql",
  },
  {
    name: "Search",
    href: "/search",
  },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className="">
      <ul className="bg-[#111113 hidden w-full items-center justify-between rounded-lg md:flex">
        {links.map((l) => (
          <Link href={l.href} key={l.href}>
            <li
              className={`border-b-2 hover:bg-brand ${pathname === l.href ? "border-b-brand font-bold" : "border-b-transparent"} bg-[#18181b] px-6 py-2 text-zinc-400 transition-all duration-150 ease-in-out hover:text-zinc-900`}
            >
              {l.name}
            </li>
          </Link>
        ))}
      </ul>
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-6 w-full bg-[#303030] text-zinc-200 hover:bg-[#494949]">
              Menu
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="pb-2 font-medium leading-none">Menu</h4>
                {links.map((l) => (
                  <Link href={l.href} key={l.href}>
                    <li
                      className={`list-none px-6 py-2 text-zinc-400 transition-all duration-150 ease-in-out hover:bg-brand hover:text-zinc-900`}
                    >
                      {l.name}
                    </li>
                  </Link>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
