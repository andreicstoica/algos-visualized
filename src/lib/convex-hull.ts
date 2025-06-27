import { Stack } from "./stack";

export type Point = {
  id: number;
  x: number;
  y: number;
};

export type MonotoneChainStep = {
  phase: "lower" | "upper";
  currentPoint?: Point;
  cp?: number;
  action: "compare" | "pop" | "push" | "start" | "done";
  lowerHull: Point[];
  upperHull: Point[];
};

// helper function
function crossProduct(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

// monotone chain algo
export function monotoneChain(points: Point[]): MonotoneChainStep[] {
  // snapshot arr
  const steps: MonotoneChainStep[] = [];
  // initial snapshot
  steps.push({
    phase: "lower",
    action: "start",
    lowerHull: [],
    upperHull: [],
  });

  // sort points by x, y as tiebreaker (making sure to copy)
  const sortedPoints = [...points].sort((p1, p2) => {
    if (p1.x !== p2.x) return p1.x - p2.x;
    return p1.y - p2.y;
  });

  // lower hull:
  //  - start at left most Point
  //  - try to rotate in clockwise direction and find the next point
  //  -- if crossproduct = negative, it is a counterclockwise turn, no bueno
  //  - repeat until we find rightmost point, rotate to find lower hull
  const lowerHull = new Stack<Point>();
  for (const point of sortedPoints) {
    while (
      lowerHull.size() >= 2 &&
      crossProduct(lowerHull.peek2()!, lowerHull.peek()!, point) <= 0
    ) {
      steps.push({
        currentPoint: point,
        phase: "lower",
        action: "compare",
        cp: crossProduct(lowerHull.peek2()!, lowerHull.peek()!, point),
        lowerHull: lowerHull.toArray(),
        upperHull: [],
      });

      // pop
      lowerHull.pop();

      steps.push({
        currentPoint: point,
        phase: "lower",
        action: "pop",
        lowerHull: lowerHull.toArray(),
        upperHull: [],
      });
    }

    // add point
    lowerHull.push(point);

    steps.push({
      currentPoint: point,
      phase: "lower",
      action: "push",
      lowerHull: lowerHull.toArray(),
      upperHull: [],
    });
  }

  // upper hull:
  // - same as above, but reversing sortedPoints
  const upperHull = new Stack<Point>();
  const reversePoints = [...sortedPoints].reverse(); // copying!
  for (const point of reversePoints) {
    while (
      upperHull.size() >= 2 &&
      crossProduct(upperHull.peek2()!, upperHull.peek()!, point) <= 0
    ) {
      steps.push({
        currentPoint: point,
        phase: "upper",
        action: "compare",
        cp: crossProduct(lowerHull.peek2()!, lowerHull.peek()!, point),
        lowerHull: lowerHull.toArray(),
        upperHull: upperHull.toArray(),
      });

      // pop
      upperHull.pop();

      steps.push({
        currentPoint: point,
        phase: "upper",
        action: "pop",
        lowerHull: lowerHull.toArray(),
        upperHull: upperHull.toArray(),
      });
    }

    // add point
    upperHull.push(point);

    steps.push({
      currentPoint: point,
      phase: "upper",
      action: "push",
      lowerHull: lowerHull.toArray(),
      upperHull: upperHull.toArray(),
    });
  }

  // combine the hulls
  // - need to pop first of upper and last of lower to avoid overlaping nodes
  //const trimmedLower = lowerHull.slice(0, lowerHull.size() - 1);
  //const trimmedUpper = upperHull.slice(1);

  return steps;
}

// visualization helper functions
function distanceBuffer(a: Point, x: number, y: number): number {
  const dx = a.x - x;
  const dy = a.y - y;
  return Math.hypot(dx, dy);
}

export function generateGraph(
  count: number,
  width: number,
  height: number,
): Point[] {
  const pointArr: Point[] = [];
  const MIN_DIST = 200; // nodes cannot be any closer than this pixel distance

  for (let i = 0; i < count; i++) {
    let x: number, y: number, ok: boolean;
    do {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);
      ok = pointArr.every((n) => distanceBuffer(n, x, y) >= MIN_DIST);
    } while (!ok);

    pointArr.push({
      id: i,
      x,
      y,
    });
  }

  return pointArr;
}

// helper for text on viz
export function describeStep(step: MonotoneChainStep): string {
  const { phase, action, currentPoint, cp } = step;
  const pDesc = currentPoint
    ? `Point (${currentPoint.x},${currentPoint.y})`
    : "";
  switch (action) {
    case "start":
      return phase === "lower" ? "Begin lower pass." : "Begin upper pass.";
    case "compare":
      return `${pDesc}: cross‐product = ${cp!.toString()}; ${
        cp! <= 0 ? "will pop" : "will keep"
      }`;
    case "pop":
      return `Pop top of ${phase} stack because cross ≤ 0.`;
    case "push":
      return `Push ${pDesc} onto ${phase} stack.`;
    case "done":
      return phase === "lower"
        ? "Lower done; switch to upper!"
        : "Upper done; hull construction finished 😎👊";
    default:
      return "";
  }
}
