import React from "react";
import { CircleDotDashed, Github } from "lucide-react";

import { Button } from "./ui/button";

export default function SearchItem() {
  return (
    <div className="w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 p-2 focus-visible:ring-zinc-900">
      <p className="text-sm text-zinc-400">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus
      </p>
      <Button className="bg-brand mt-4 h-9 w-full text-black hover:bg-[#f8633b]">
        <CircleDotDashed size={18} className="mr-2" />
        Try
      </Button>
    </div>
  );
}
