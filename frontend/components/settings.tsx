"use client";

import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export default function Settings({
  reordered,
  setReordered,
}: {
  reordered: boolean;
  setReordered: (value: boolean) => void;
}) {
  return (
    <div className="mx-auto my-10 flex w-full items-end">
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
      {!reordered ? null : (
        <>
          {/* <div className="flex items-center">
            <Label className="mr-2 text-sm text-zinc-500">Language</Label>
            <Select>
              <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
                <SelectItem
                  value="english"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  English
                </SelectItem>
                <SelectItem
                  value="latin"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  Latin
                </SelectItem>
                <SelectItem
                  value="german"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  German
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="mx-4 flex items-center">
            <Label className="mr-2 text-sm text-zinc-500">Persona</Label>
            <Select>
              <SelectTrigger className="mt-1 w-[180px] border-2 border-zinc-800">
                <SelectValue placeholder="Persona" />
              </SelectTrigger>
              <SelectContent className="border-2 border-zinc-800 bg-zinc-800 text-zinc-200">
                <SelectItem
                  value="programmer"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  Programmer
                </SelectItem>
                <SelectItem
                  value="grandma"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  Grandma
                </SelectItem>
                <SelectItem
                  value="rapper"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  Rapper
                </SelectItem>
                <SelectItem
                  value="cowboy"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  Cowboy
                </SelectItem>
                <SelectItem
                  value="robot"
                  className="focus:bg-brand hover:bg-brand hover:text-black focus:text-black"
                >
                  Robot
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
