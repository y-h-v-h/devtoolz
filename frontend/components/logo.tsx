import React from "react";
import Image from "next/image";
import { Code, Wrench } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex">
      {/* <Wrench size={32} /> */}
      <div className="ml- flex flex-col">
        <h2 className="text-brand text-xl font-black uppercase">dev2oolz</h2>
        <p className="text-zinc-500">
          by{" "}
          <a
            href="https://github.com/lucky-chap"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            huncho
          </a>{" "}
          on{" "}
          <a
            href="https://github.com/lucky-chap/2oolz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            github
          </a>
        </p>
      </div>
    </div>
  );
}
