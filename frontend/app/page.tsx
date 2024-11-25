import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-[100rem] flex-col justify-between">
      <ul className="flex items-center justify-between p-5">
        <li className="flex items-center text-2xl font-bold sm:text-3xl">
          🛠️ devtoolz
        </li>
        <a
          href="https://github.com/y-h-v-h/devtoolz"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <li className="flex items-center font-bold">
            <Star
              size={14}
              className="mr-2 text-zinc-300 group-hover:text-white"
            />
            <span className="text-zinc-300 group-hover:text-white">star</span>
          </li>
        </a>
      </ul>
      <div className="z-1 relative mx-auto max-w-[900px] px-4 sm:px-8 xl:px-0">
        <div className="text-center">
          <h1 className="xl:text-heading-1 mb-6 text-3xl font-extrabold text-white sm:text-5xl">
            Your Shortcut to Seamless Development Success 🛠️
          </h1>
          <p className="max-w- mx-auto mb-9 text-base font-medium text-zinc-400 md:text-lg">
            Our platform offers a range of powerful tools to simplify your
            development life. Streamline your development process with tools
            that make solving challenges faster, smarter, and easier with AI
          </p>

          <Link href={"/regex"}>
            <Button className="mx-auto mr-5 h-9 w-full max-w-2xl bg-brand text-black hover:bg-[#f8633b]">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="py-2 text-zinc-500">
          by{" "}
          <a
            href="https://github.com/y-h-v-h"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white"
          >
            syd
          </a>{" "}
          on{" "}
          <a
            href="https://github.com/y-h-v-h/devtoolz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white"
          >
            github
          </a>
        </p>
      </div>
    </section>
  );
}
