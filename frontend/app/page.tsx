"use client";

import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const user = useQuery(api.user.viewer);
  const { signIn } = useAuthActions();
  return (
    <section className="flex flex-col lg:flex-row">
      <p>Hello {user?.name}</p>
      <Button onClick={() => void signIn("github")}>Login</Button>
    </section>
  );
}
