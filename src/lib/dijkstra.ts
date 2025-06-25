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

import MinHeap from "heap-js";

// generate a random tree with random branches
export function generateTree(
  numNodes: number,
  maxWeight: number,
  pxW: number,
  pxH: number,
): Node[] {
  if (numNodes <= 0) return [];

  const nodes: Node[] = [];

  // initialize node array with random coords for viz
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      id: i,
      visited: false,
      neighbors: [],
      x: Math.random() * pxW,
      y: Math.random() * pxH,
    });
  }

  // randomize branches
  for (let i = 1; i < numNodes; i++) {
    const node2 = nodes[i]; // current node

    const randomIndex = Math.floor(Math.random() * i); // index will be between 0 and i-1
    const node1 = nodes[randomIndex];

    // typescript exist check
    if (!node1 || !node2) {
      throw new Error("Internal error: Node not found during branch creation.");
    }

    const weight = Math.floor(Math.random() * maxWeight) + 1; // Ensure weight is at least 1 for Dijkstra

    const branch: Edge = { node1, node2, weight };

    // Add the branch to both nodes' neighbor lists (undirected graph)
    node1.neighbors.push(branch);
    node2.neighbors.push(branch);
  }

  return nodes;
}

// dijkstra's algorithm
const dijkstra = (tree: Node[]) => {
  // thanks typescript
  if (!tree || tree.length === 0) {
    throw new Error("bad tree to dijkstra over");
  }

  const distances = new Map<number, number>(); // <NodeId, Distance>
  const previousNodes = new Map<number, Node | null>(); // <NodeId, PreviousNodeInShortestPath>
  const minHeap = new MinHeap<{ node: Node; distance: number }>(
    (a, b) => a.distance - b.distance,
  ); // two nodes to compare passed to heap operation

  const origin: Node = tree[0]!;

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

  while (minHeap.size() > 0) {
    const { node: currentNode, distance: currentDistance } = minHeap.pop()!;

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

      if (newDistance < currentNeighborDistance) {
        distances.set(currentNode.id, newDistance);
        previousNodes.set(neighborNode.id, currentNode);
        minHeap.push({ node: neighborNode, distance: newDistance });
      }
    }
  }
  console.log("Shortest Distances:", distances);
  return { distances, previousNodes };
};

const tree = generateTree(9, 5, 0, 0);
dijkstra(tree);
