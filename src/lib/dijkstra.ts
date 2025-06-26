import MinHeap from "heap-js";
// import * as d3 from "d3";

export type Edge = {
  node1: Node;
  node2: Node;
  weight: number;
};

export type Node = {
  id: number;
  visited: boolean;
  neighbors: Edge[];
  x: number;
  y: number;
};

// clean graph helper (no overlapping nodes)
function distance(a: Node, x: number, y: number): number {
  const dx = a.x - x;
  const dy = a.y - y;
  return Math.hypot(dx, dy);
}

// generate a random tree with random branches
export function generateTree(
  numNodes: number,
  maxWeight: number,
  pxW: number,
  pxH: number,
): Node[] {
  if (numNodes <= 0) return [];

  const nodes: Node[] = [];
  const MIN_DIST = 200; // nodes cannot be any closer than this pixel distance

  // initialize node array with random coords for viz
  for (let i = 0; i < numNodes; i++) {
    let x: number, y: number, ok: boolean;
    do {
      console.log("hi");
      x = Math.random() * pxW;
      y = Math.random() * pxH;
      ok = nodes.every((n) => distance(n, x, y) >= MIN_DIST);
    } while (!ok);

    nodes.push({
      id: i,
      visited: false,
      neighbors: [],
      x,
      y,
    });
  }

  // add randomized branches that don't overlap
  for (let i = 1; i < numNodes; i++) {
    const node2 = nodes[i]; // current node

    const randomIndex = Math.floor(Math.random() * i); // index will be between 0 and i-1
    const node1 = nodes[randomIndex];

    // thanks typescript
    if (!node1 || !node2) {
      throw new Error("Internal error: Node not found during branch creation.");
    }

    const weight = Math.floor(Math.random() * maxWeight) + 1; // weight is at least 1

    const branch: Edge = { node1, node2, weight };

    // add the branch to both nodes' neighbor lists (undirected graph)
    node1.neighbors.push(branch);
    node2.neighbors.push(branch);
  }

  return nodes;
}

// object for visualizing dijkstra's algorithm
export type DijkstraStep = {
  distances: number[];
  visited: boolean[];
  currentNode: number;
  path?: number[];
  activeEdge?: Edge;
};

// side effect list for now

// dijkstra's algorithm
export const dijkstra = (tree: Node[]): DijkstraStep[] => {
  const dijkstraSteps: DijkstraStep[] = [];

  // thanks typescript
  if (!tree || tree.length === 0) {
    throw new Error("bad tree to dijkstra over");
  }
  // these two arrs are for visualizing
  const distancesArr = new Array(tree.length).fill(Infinity);
  const visitedArr = new Array(tree.length).fill(false);

  const distances = new Map<number, number>(); // <NodeId, Distance>
  const previousNodes = new Map<number, Node | null>(); // <NodeId, PreviousNodeInShortestPath>
  const minHeap = new MinHeap<{ node: Node; distance: number }>(
    (a, b) => a.distance - b.distance,
  ); // two nodes to compare passed to heap operation

  // set origin as first node, update visualization distancesArr
  const origin: Node = tree[0]!;
  distancesArr[origin.id] = 0;

  // initialize node distances
  for (const node of tree) {
    if (node === origin) {
      distances.set(node.id, 0);
      minHeap.push({ node: origin, distance: 0 }); // push origin to heap for loop l8r
    } else {
      distances.set(node.id, Infinity);
    }
    previousNodes.set(node.id, null); // no prev nodes to start
  }

  dijkstraSteps.push({
    distances: Array.from(
      { length: tree.length },
      (_, i) => distances.get(i) ?? Infinity,
    ),
    visited: visitedArr.slice() as boolean[],
    currentNode: origin.id,
  });

  while (minHeap.size() > 0) {
    const { node: currentNode, distance: currentDistance } = minHeap.pop()!;

    // update distancesArr to match the current
    // state of distances map (for graph visual)
    for (let i = 0; i < tree.length; i++) {
      distancesArr[i] = distances.get(i) ?? Infinity;
    }

    // store initial state for visualization
    visitedArr[currentNode.id] = true;
    dijkstraSteps.push({
      distances: distancesArr.slice() as number[],
      visited: visitedArr.slice() as boolean[],
      currentNode: currentNode.id,
    });

    // if we've found a shorter distance, pass
    if (currentDistance > (distances.get(currentNode.id) ?? Infinity)) {
      continue;
    }

    for (const edge of currentNode.neighbors) {
      // finding node in edge that isn't currentNode
      const neighborNode = edge.node1 === currentNode ? edge.node2 : edge.node1;

      const newDistance = currentDistance + edge.weight;

      const currentNeighborDistance =
        distances.get(neighborNode.id) ?? Infinity;

      // snapshot the active edge for visualization
      dijkstraSteps.push({
        distances: distancesArr.slice() as number[],
        visited: visitedArr.slice() as boolean[],
        currentNode: currentNode.id,
        activeEdge: edge,
      });

      if (newDistance < currentNeighborDistance) {
        distances.set(neighborNode.id, newDistance);
        previousNodes.set(neighborNode.id, currentNode);
        minHeap.push({ node: neighborNode, distance: newDistance });

        // update distancesArr when we find a shorter path
        distancesArr[neighborNode.id] = newDistance;
        dijkstraSteps.push({
          distances: distancesArr.slice() as number[],
          visited: visitedArr.slice() as boolean[],
          currentNode: currentNode.id,
          activeEdge: edge,
        });
      }
    }
  }

  return dijkstraSteps;
};
