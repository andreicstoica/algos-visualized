"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Algorithms Visualized
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-pretty">
          Interactive visualizations of core algorithms to demonstrate
          understanding.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="default">Fractal Bootcamp</Badge>
          <Badge variant="neutral">React</Badge>
          <Badge variant="neutral">TypeScript</Badge>
          <Badge variant="neutral">Next.js</Badge>
          <Badge variant="neutral">Framer Motion</Badge>
        </div>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>About This Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Part of the{" "}
            <Link className="underline" href="https://fractalbootcamp.com/">
              Fractal Bootcamp <ExternalLink className="mb-1 inline size-4" />
            </Link>{" "}
            curriculum, I&apos;ve created visualizations for core algorithms.
            They showcases my understanding each algorithm.
          </p>
          <p>
            Each algorithm is presented with step-by-step animations, allowing
            users to see exactly how the algorithm works under the hood.
          </p>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Frontend Stack</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Next.js 14 with App Router</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Framer Motion for animations</li>
                <li>• Shadcn/ui components</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Key Features</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Interactive step-by-step animations</li>
                <li>• Real-time algorithm visualization</li>
                <li>• Custom input validation</li>
                <li>• Responsive design</li>
                <li>• Smooth transitions and effects</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Through this project, I&apos;ve deepened my understanding of:</p>
          <div className="grid gap-2 md:grid-cols-2">
            <ul className="space-y-1 text-sm">
              <li>• Algorithm complexity analysis</li>
              <li>• Recursive problem-solving</li>
              <li>• State management in React</li>
              <li>• Animation and user experience design</li>
            </ul>
            <ul className="space-y-1 text-sm">
              <li>• TypeScript best practices</li>
              <li>• Modern React patterns (like tRPC)</li>
              <li>• Component architecture</li>
              <li>• Performance optimization</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
