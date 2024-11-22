import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex min-h-screen w-full">
      <p>Hello World</p>
      <Link href={"/sql"}>
        <Button>SQL TOOL</Button>
      </Link>
    </section>
  );
}
