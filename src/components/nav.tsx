"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="border-b-border rounded-tr-base h-12 border-b-4 bg-black text-2xl">
      <div className="grid h-full grid-cols-[1fr_1fr_auto]">
        <Link
          className={clsx(
            "flex h-full items-center justify-center uppercase",
            path === "/" ||
              path === "/quick-sort" ||
              path === "/dijkstra" ||
              path === "/convex-hull"
              ? "bg-black text-white"
              : "bg-main text-black",
          )}
          href="/"
        >
          PROJECTS
        </Link>
        <Link
          className={clsx(
            "flex h-full items-center justify-center uppercase",
            path === "/about" ? "bg-black text-white" : "bg-main text-black",
          )}
          href="/about"
        >
          ABOUT
        </Link>
        <div className="flex items-center justify-center px-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
