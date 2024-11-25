import React from "react";
import Image from "next/image";
import { Code, Wrench } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex w-full">
      {/* <Wrench size={32} /> */}
      <div className="ml- flex flex-col">
        <li className="flex items-center text-2xl font-bold sm:text-3xl">🛠️</li>
      </div>
    </div>
  );
}
