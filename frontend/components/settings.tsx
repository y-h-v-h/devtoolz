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
          type="button"
          onClick={() => setReordered(!reordered)}
          className="mr-5 h-9 bg-zinc-800 hover:bg-[#111113]"
        >
          <ArrowUpDown size={18} className="mr-2" />
          Reorder
        </Button>
      </div>
    </div>
  );
}
