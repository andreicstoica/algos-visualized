import { Stack } from "./stack";

export type Point = {
  id: number;
  visited: boolean;
  x: number;
  y: number;
};

// helper function
function crossProduct(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

// monotone chain algo
export function monotoneChain(points: Point[]): Point[] {
  // need enough to iterate through
  if (points.length < 4) {
    return points;
  }

  // sort points by x, y as tiebreaker (making sure to copy)
  const sortedPoints = [...points].sort((p1, p2) => {
    if (p1.x !== p2.x) return p1.x - p2.x;
    return p1.y - p2.y;
  });

  // lower hull:
  //  - start at left most Point
  //  - try to rotate in clockwise direction and find the next point
  //  -- if crossproduct - it is a counterclockwise turn, no bueno
  //  - repeat until we find rightmost point, rotate to find lower hull
  const lowerHull = new Stack<Point>();
  for (const point of sortedPoints) {
    while (
      lowerHull.size() >= 2 &&
      crossProduct(lowerHull.peek2()!, lowerHull.peek()!, point) <= 0
    ) {
      lowerHull.pop();
    }
    lowerHull.push(point);
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
      upperHull.pop();
    }
    upperHull.push(point);
  }

  // combine the hulls
  // - need to pop first of upper and last of lower to avoid overlaping nodes
  const trimmedLower = lowerHull.slice(0, lowerHull.size() - 1);
  const trimmedUpper = upperHull.slice(1);

  return [...trimmedLower, ...trimmedUpper];
}

// Visualization Generation Functions

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
      visited: false,
      x,
      y,
    });
  }

  return pointArr;
}
