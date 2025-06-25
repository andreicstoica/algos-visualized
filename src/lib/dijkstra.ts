export type Branch = {
  node1: Node;
  node2: Node;
  weight: number;
};

export type Node = {
  id: number;
  visited: boolean;
  neighbors: Branch[];
  x: number;
  y: number;
};

//const distanceArr: { node: Node; distance: number } = [];

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

    const branch: Branch = { node1, node2, weight };

    // Add the branch to both nodes' neighbor lists (undirected graph)
    node1.neighbors.push(branch);
    node2.neighbors.push(branch);
  }

  return nodes;
}

