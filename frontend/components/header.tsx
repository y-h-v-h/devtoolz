import React from "react";
import Link from "next/link";
import { Github, Key } from "lucide-react";

import Logo from "./logo";
import Nav from "./nav";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="mb-12 flex items-center justify-between">
      <Link href={"/"}>
        <Logo />
      </Link>
      <div className="w-full">
        <div className="mx-auto max-w-md">
          <Nav />
        </div>
      </div>
    </div>
  );
}
