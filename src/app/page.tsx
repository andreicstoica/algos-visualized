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
    <main className="flex flex-1 flex-col items-center justify-around gap-4 p-4 md:flex-row">
      <Card className="bg-secondary-background flex w-full flex-col px-4 md:w-fit">
        <CardTitle>Quick Sort</CardTitle>
        <CardDescription className="flex-1 text-pretty sm:w-full md:max-w-sm">
          A highly efficient, in-place sorting algorithm using a &apos;divide
          and conquer&apos; strategy around a &apos;pivot&apos;.
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

      <Card className="bg-secondary-background flex w-full flex-col px-4 md:w-fit">
        <CardTitle>Convex Hull</CardTitle>
        <CardDescription className="flex-1 text-pretty sm:w-full md:max-w-sm">
          Visualize the Graham scan algorithm find the smallest convex polygon
          that contains all points in a set.
        </CardDescription>
        <CardAction>
          <Button
            onClick={() => router.push("/convex-hull")}
            className="px-5 py-3"
          >
            Visit
          </Button>
        </CardAction>
      </Card>

      <Card className="bg-secondary-background flex w-full flex-col px-4 md:w-fit">
        <CardTitle>Dijkstra&apos;s</CardTitle>
        <CardDescription className="flex-1 text-pretty sm:w-full md:max-w-sm">
          Find the shortest path using Dijkstra&apos;s algorithm, which
          revolutionized computer science.
        </CardDescription>
        <CardAction>
          <Button
            onClick={() => router.push("/dijkstra")}
            className="px-5 py-3"
          >
            Visit
          </Button>
        </CardAction>
      </Card>
    </main>
  );
}
