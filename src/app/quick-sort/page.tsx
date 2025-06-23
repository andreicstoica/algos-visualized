"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";

import QuickSortVisualization from "@/components/quick-sort-visualization";
import {
  quickSortAnimated,
  quickSort,
  type SortStepNode,
} from "@/lib/quick-sort";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

const formSchema = z.object({
  numbers: z.string().min(1, {
    message: "Please enter some numbers.",
  }),
});

export default function QuickSortPage() {
  // STATE //
  const [numberArr, setNumberArr] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStepNode[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { numbers: "" },
  });

  type FormData = z.infer<typeof formSchema>;

  const onSubmit = (data: FormData) => {
    setShowResult(true);
    const parsedNumbers = data.numbers
      .split(",")
      .map((numStr) => parseFloat(numStr.trim()))
      .filter((num) => !isNaN(num));

    if (parsedNumbers.length >= 2) {
      setNumberArr(parsedNumbers);
      setSteps(quickSortAnimated(parsedNumbers));
    }
  };

  return (
    <div>
      <h1>Quick Sort Visualization</h1>
      <p>Visualize the quick sort algorithm step by step.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="numbers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>List some numbers</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A list of numbers split by commas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div className="mt-2 flex flex-col gap-2">
        {steps.map((step, i) => (
          <QuickSortVisualization key={i} steps={steps} />
        ))}
      </div>

      {/* sorted list result card */}
      <Card
        className={clsx(
          showResult === true ? "visible" : "hidden",
          "mx-auto w-full max-w-md items-center",
        )}
      >
        <CardHeader className="w-full justify-center">
          <CardTitle>Final Result</CardTitle>
        </CardHeader>
        <CardContent>{quickSort(numberArr).toString()}</CardContent>
      </Card>
    </div>
  );
}
