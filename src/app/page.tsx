"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-1 items-center justify-center gap-6">
      <Card className="bg-secondary-background w-fit px-4">
        <CardTitle>Quick Sort</CardTitle>
        <CardDescription className="max-w-md text-pretty">
          A highly efficient, in-place sorting algorithm that leverages a
          &apos;divide and conquer&apos; strategy, quickly sub-dividing around a
          &apos;pivot&apos;.
        </CardDescription>
        <CardAction>
          <Button
            onClick={() => router.push("/quick-sort")}
            className="px-5 py-3"
          >
            Visit
          </Button>
        </CardAction>
      </Card>

      <Card className="bg-secondary-background w-fit px-4">
        <CardTitle>Graph Traversal</CardTitle>
        <CardDescription className="max-w-md text-pretty">
          Explore depth-first and breadth-first search algorithms with
          interactive node-by-node visualization. Coming soon.
        </CardDescription>
        <CardAction>
          <Button disabled className="px-5 py-3">
            Coming Soon
          </Button>
        </CardAction>
      </Card>
    </main>
  );
}
