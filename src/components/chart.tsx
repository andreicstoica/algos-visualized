import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

const chartConfig = {
  node: {
    label: "Node",
    color: "var(--color-primary-foreground)",
  },
} satisfies ChartConfig;

export default function Chart({
  distances,
  maxDistance,
}: {
  distances: number[];
  maxDistance?: number;
}) {
  // recharts expects array of objects, not numbers
  const data = distances.slice(1).map((distance, i) => ({
    node: `Node ${i + 1}`,
    distance: distance === Infinity ? 0 : distance,
    originalDistance: distance, // keep original for tooltip
  }));

  return (
    <ChartContainer config={chartConfig} className="mt-6 h-40 w-full">
      <BarChart accessibilityLayer data={data} margin={{ left: -40, right: 4 }}>
        <CartesianGrid vertical={true} strokeDasharray="3 3" />
        <YAxis
          tickLine={false}
          tickMargin={1}
          tick={{
            fontSize: 10,
          }}
          domain={[0, maxDistance ?? 10]}
          ticks={Array.from({ length: maxDistance ?? 10 }, (_, i) => i)}
        />
        <XAxis
          dataKey="node"
          tickLine={false}
          tick={{
            fontSize: 10,
          }}
          tickFormatter={(value: string) => value}
          interval={0}
        />
        <ChartTooltip
          cursor={false}
          content={({ payload }: { payload?: Array<{ payload: unknown }> }) => {
            const data = payload?.[0]?.payload as
              | { node: string; originalDistance: number }
              | undefined;
            if (data) {
              return (
                <div className="bg-background rounded border p-2">
                  <p>
                    {data.node}:{" "}
                    {data.originalDistance === Infinity
                      ? "∞"
                      : data.originalDistance}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="distance" radius={1} fill="var(--color-main)" />
      </BarChart>
    </ChartContainer>
  );
}

// {
//     currentStep.distances.map((d, i) => <Badge />);
// }
