import React from "react";
import Link from "next/link";
import { Github, Key } from "lucide-react";

import Logo from "./logo";
import Nav from "./nav";
import { Button } from "./ui/button";

export default function Header() {
  return (
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
          <Button className="mr-5 h-9 bg-zinc-800 hover:bg-[#111113]">
            <Github size={18} className="mr-2" />
            Github
          </Button>
        </Link>
      </ul>
    </div>
  );
}
