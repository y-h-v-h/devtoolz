"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ArrowUpDown, CircleDotDashed, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/logo";
import Nav from "@/components/nav";

export default function Home() {
  const user = useQuery(api.user.viewer);
  const { signIn } = useAuthActions();
  const [reordered, setReordered] = useState(false);
  return (
    <section className="flex min-h-screen w-full">
      <p>Hello World</p>
      <Link href={"/sql"}>
        <Button>SQL TOOL</Button>
      </Link>
    </section>
  );
}
