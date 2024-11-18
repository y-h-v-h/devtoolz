"use client";

import React from "react";
import Link from "next/link";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "SQL",
    href: "/sql",
  },
  {
    name: "Git",
    href: "/git",
  },
  {
    name: "Regex",
    href: "/regex",
  },
  {
    name: "History",
    href: "/history",
  },
];

export default function Nav() {
  return (
    <ul className="flex items-center justify-evenly rounded-lg bg-[#111113] py-3">
      {links.map((l) => (
        <Link href={l.href} key={l.href}>
          <li className="hover:bg-brand mx-2 rounded-lg bg-[#18181b] px-4 py-2 text-zinc-400 transition-all duration-150 ease-in-out hover:text-zinc-900">
            {l.name}
          </li>
        </Link>
      ))}
    </ul>
  );
}
