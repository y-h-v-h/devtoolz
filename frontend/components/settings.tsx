"use client";

import React from "react";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ArrowUpDown } from "lucide-react";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function Settings({
  reordered,
  setReordered,
}: {
  reordered: boolean;
  setReordered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`mx-auto flex w-full max-w-4xl flex-col ${reordered ? "flex-col-reverse" : ""}`}
    >
      <div className="flex flex-col">
        <Label className="text-sm">Naturual Language</Label>
        <Textarea
          className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
          placeholder={`${reordered ? "Converted git command in natural language" : "What you do you want to convert to a git command?"}`}
          rows={5}
          cols={10}
        />
      </div>

      <div className="mx-auto my-10 flex w-full items-center">
        <div className="flex flex-col">
          <Label className="mb-5 text-sm text-zinc-500"></Label>
          <Button
            onClick={() => setReordered(!reordered)}
            className="mr-5 h-9 bg-zinc-800 hover:bg-[#111113]"
          >
            <ArrowUpDown size={18} className="mr-2" />
            Reorder
          </Button>
        </div>
        <div className="">
          <Label className="mb-1 text-sm text-zinc-500">Language</Label>
          <Select>
            <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
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
        <div className="mx-4">
          <Label className="mb-1 text-sm text-zinc-500">Persona</Label>
          <Select>
            <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
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
      </div>

      <div className="flex flex-col">
        <Label className="text-sm">Git command</Label>
        <Textarea
          className="mt-4 h-48 max-h-48 min-h-48 w-full rounded-xl border-2 border-zinc-900 bg-zinc-800 focus-visible:ring-zinc-900"
          placeholder={`${reordered ? "Your git command" : "Git command"}`}
          rows={5}
          cols={10}
        />
      </div>
    </div>
  );
}
