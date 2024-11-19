"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <ul className="bg-[#111113 flex items-center justify-between rounded-lg">
      {links.map((l) => (
        <Link href={l.href} key={l.href}>
          <li
            className={`hover:bg-brand border-b-2 ${pathname === l.href ? "border-b-brand font-bold" : "border-b-transparent"} bg-[#18181b] px-6 py-2 text-zinc-400 transition-all duration-150 ease-in-out hover:text-zinc-900`}
          >
            {l.name}
          </li>
        </Link>
      ))}
    </ul>
  );
}
