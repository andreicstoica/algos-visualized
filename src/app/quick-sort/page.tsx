"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  const [showModal, setShowModal] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { numbers: "" },
  });

  type FormData = z.infer<typeof formSchema>;

  const onSubmit = (data: FormData) => {
    setShowModal(false);
    setShowResult(true);
    const parsedNumbers = data.numbers
      .split(",")
      .map((numStr) => parseFloat(numStr.trim()))
      .filter((num) => !isNaN(num));

    if (parsedNumbers.length >= 2) {
      setNumberArr(parsedNumbers);
      setSteps(quickSortAnimated(parsedNumbers));
    } else {
      setNumberArr([]);
      setSteps([]);
    }
  };

  return (
    <div>
      <h1>Quick Sort Visualization</h1>
      <p>Visualize the quick sort algorithm step by step.</p>

      {/* Modal for number input */}
      <AlertDialog open={showModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Visualizing Quick Sort</AlertDialogTitle>
            <AlertDialogDescription>
              List some numbers separated by commas. Click &quot;Continue&quot;
              to see the step-by-step visualization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="numbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List some numbers</FormLabel>
                    <FormControl>
                      <Input placeholder="1,5,2,3,4" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      1,8,3,7,4,6,5,3,6 - if you&apos;re lazy 😉
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button type="submit">Continue</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Visualization and result only after modal is closed and valid numbers are present */}
      {showResult && steps.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          <QuickSortVisualization steps={steps} />
        </div>
      )}

      {/* sorted list result card */}
      <Card
        className={clsx(
          showResult && numberArr.length > 0 ? "visible" : "hidden",
          "mx-auto w-auto items-center",
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
