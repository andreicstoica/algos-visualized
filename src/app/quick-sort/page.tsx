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
  type SortStepInterface,
} from "@/lib/quick-sort";

const formSchema = z.object({
  numbers: z.string().min(1, {
    message: "Please enter some numbers.",
  }),
});

export default function QuickSortPage() {
  // STATE //
  const [numberArr, setNumberArr] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStepInterface[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { numbers: "" },
  });

  type FormData = z.infer<typeof formSchema>;

  const onSubmit = (data: FormData) => {
    const parsedNumbers = data.numbers
      .split(",")
      .map((numStr) => parseFloat(numStr.trim()))
      .filter((num) => !isNaN(num));

    if (parsedNumbers.length >= 2) {
      setNumberArr(parsedNumbers);
      setSteps(quickSortAnimated(parsedNumbers));
      console.log(steps);
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
                    placeholder="19, 8, 1, 29, 11, 0, 12, 13, 4"
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

      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <QuickSortVisualization key={i} steps={steps} currentStepIndex={i} />
        ))}
      </div>

      <div>OG: {quickSort(numberArr).toString()}</div>
    </div>
  );
}
