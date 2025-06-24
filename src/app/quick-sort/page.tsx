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
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

import { useForm } from "react-hook-form";
import { useState } from "react";

import QuickSortVisualization from "@/components/quick-sort-visualization";
import {
  quickSort,
  type AnimatedTreeNode,
  quickSortAnimatedTree,
} from "@/lib/quick-sort";

const formSchema = z.object({
  numbers: z.string().min(1, {
    message: "Please enter some numbers.",
  }),
});

export default function QuickSortPage() {
  // STATE //
  const [numberArr, setNumberArr] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(true);
  const [tree, setTree] = useState<AnimatedTreeNode | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const [visibleDepth, setVisibleDepth] = useState(0);

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
      setTree(quickSortAnimatedTree(parsedNumbers));
    } else {
      setNumberArr([]);
      setTree(null);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Card className="bg-secondary-background mx-auto w-fit">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-center">
            Quick Sort Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-center">
            Visualize the quick sort algorithm step by step.
          </p>
          <Button
            className="mt-4"
            onClick={() => setVisibleDepth((d) => d + 1)}
          >
            Next Step
          </Button>
        </CardContent>
      </Card>

      {/* alert dialog for number input */}
      <AlertDialog open={showModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Visualizing Quick Sort</AlertDialogTitle>
            <AlertDialogDescription>
              List some numbers separated by commas. Quick sort uses a pivot to
              do its magic... this demo just uses the last number as the pivot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="numbers"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="1, 2, 3" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      1,8,3,7,4,6 - a premade list, for you to sort
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

      {/* viz animation after modal is closed and valid numbers are present */}
      {showResult && tree && (
        <div className="mt-2 flex flex-col gap-2">
          <QuickSortVisualization
            tree={tree}
            maxDepth={visibleDepth}
            onAnimationComplete={() => setAnimationDone(true)}
          />
        </div>
      )}

      {/* sorted list result card */}
      <AnimatePresence>
        {showResult && numberArr.length > 0 && animationDone && (
          <motion.div
            key="final-result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <Card className="bg-secondary-background mx-auto w-fit items-center px-10 py-8 whitespace-nowrap">
              <CardHeader className="w-full justify-center">
                <CardTitle>Final Result</CardTitle>
              </CardHeader>
              <CardContent>{quickSort(numberArr).toString()}</CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
