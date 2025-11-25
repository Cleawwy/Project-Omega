import { NextRequest, NextResponse } from 'next/server';
import klGraphData from '@/data/kl_graph.json';
import { MinHeap } from '@/lib/MinHeap';

type GraphData = {
  nodes: [number, number][];
  neighbors: [number, number][][];
};


const KL_COORDS = (klGraphData as GraphData).nodes as [number, number][];
const KL_NEIGH = (klGraphData as GraphData).neighbors as [number, number][][];


const COORDS: [number, number][] = KL_COORDS;
const NEIGH: [number, number][][] = KL_NEIGH;

function nearest(lat: number, lon: number): number {
  let minDist = Infinity;
  let minIdx = 0;

  for (let i = 0; i < COORDS.length; i++) {
    const dlat = COORDS[i][0] - lat;
    const dlon = COORDS[i][1] - lon;
    const dist = dlat * dlat + dlon * dlon;

    if (dist < minDist) {
      minDist = dist;
      minIdx = i;
    }
  }

  return minIdx;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; 
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function dijkstraOnce(sIdx: number, tIdx: number): { path: number[]; cost: number | null; visited: number; visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] } {
  const n = NEIGH.length;
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);

  dist[sIdx] = 0;
  let visitedCount = 0;
  const visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] = [];

  const pq = new MinHeap<{ node: number; dist: number }>((a, b) => a.dist - b.dist);
  pq.push({ node: sIdx, dist: 0 });

  while (!pq.isEmpty()) {
    const { node: u, dist: d } = pq.pop()!;

    if (d > dist[u]) continue;

    visitedCount++;
    if (prev[u] !== -1) {
      visitedEdges.push({
        from: { lat: COORDS[prev[u]][0], lng: COORDS[prev[u]][1] },
        to: { lat: COORDS[u][0], lng: COORDS[u][1] }
      });
    }

    if (u === tIdx) break;

    for (let j = 0; j < NEIGH[u].length; j++) {
      const v = NEIGH[u][j][0];
      const weight = NEIGH[u][j][1];

      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = u;
        pq.push({ node: v, dist: dist[v] });
      }
    }
  }

  const path: number[] = [];
  let currentNode = tIdx;

  if (dist[currentNode] === Infinity) {
    return { path: [], cost: null, visited: visitedCount, visitedEdges };
  }

  while (currentNode !== -1) {
    path.unshift(currentNode);
    currentNode = prev[currentNode];
  }

  return {
    path: path,
    cost: dist[tIdx],
    visited: visitedCount,
    visitedEdges
  };
}

function astarOnce(sIdx: number, tIdx: number): { path: number[]; cost: number | null; visited: number; visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] } {
  const n = NEIGH.length;
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);

  dist[sIdx] = 0;
  let visitedCount = 0;
  const visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] = [];

  const pq = new MinHeap<{ node: number; f: number }>((a, b) => a.f - b.f);
  pq.push({ node: sIdx, f: 0 });

  while (!pq.isEmpty()) {
    const { node: u, f } = pq.pop()!;

    if (f > dist[u] + haversine(COORDS[u][0], COORDS[u][1], COORDS[tIdx][0], COORDS[tIdx][1])) continue;

    visitedCount++;
    if (prev[u] !== -1) {
      visitedEdges.push({
        from: { lat: COORDS[prev[u]][0], lng: COORDS[prev[u]][1] },
        to: { lat: COORDS[u][0], lng: COORDS[u][1] }
      });
    }

    if (u === tIdx) break;

    for (let j = 0; j < NEIGH[u].length; j++) {
      const v = NEIGH[u][j][0];
      const weight = NEIGH[u][j][1];

      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = u;
        const h = haversine(COORDS[v][0], COORDS[v][1], COORDS[tIdx][0], COORDS[tIdx][1]);
        pq.push({ node: v, f: dist[v] + h });
      }
    }
  }

  const path: number[] = [];
  let currentNode = tIdx;

  if (dist[currentNode] === Infinity) {
    return { path: [], cost: null, visited: visitedCount, visitedEdges };
  }

  while (currentNode !== -1) {
    path.unshift(currentNode);
    currentNode = prev[currentNode];
  }

  return {
    path: path,
    cost: dist[tIdx],
    visited: visitedCount,
    visitedEdges
  };
}

function bfsOnce(sIdx: number, tIdx: number): { path: number[]; cost: number | null; visited: number; visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] } {
  const n = NEIGH.length;
  const visited = new Array(n).fill(false);
  const prev = new Array(n).fill(-1);
  const queue: number[] = [];

  queue.push(sIdx);
  visited[sIdx] = true;
  let visitedCount = 1;

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (node === tIdx) break;

    for (let j = 0; j < NEIGH[node].length; j++) {
      const neigh = NEIGH[node][j][0];

      if (!visited[neigh]) {
        visited[neigh] = true;
        visitedCount++;
        prev[neigh] = node;
        queue.push(neigh);
      }
    }
  }

  if (!visited[tIdx]) {
    return { path: [], cost: null, visited: visitedCount, visitedEdges: [] };
  }

  const path: number[] = [];
  let currentNode = tIdx;

  while (currentNode !== -1) {
    path.unshift(currentNode);
    currentNode = prev[currentNode];
  }

  let cost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    for (let j = 0; j < NEIGH[u].length; j++) {
      if (NEIGH[u][j][0] === v) {
        cost += NEIGH[u][j][1];
        break;
      }
    }
  }

  return { path, cost, visited: visitedCount, visitedEdges: [] };
}

function dfsOnce(sIdx: number, tIdx: number): { path: number[]; cost: number | null; visited: number; visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] } {
  const n = NEIGH.length;
  const visited = new Array(n).fill(false);
  const prev = new Array(n).fill(-1);
  const stack: number[] = [];

  stack.push(sIdx);
  visited[sIdx] = true;
  let visitedCount = 1;

  let found = false;

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (node === tIdx) {
      found = true;
      break;
    }

    for (let j = 0; j < NEIGH[node].length; j++) {
      const neigh = NEIGH[node][j][0];
      if (!visited[neigh]) {
        visited[neigh] = true;
        visitedCount++;
        prev[neigh] = node;
        stack.push(neigh);
      }
    }
  }

  if (!found && !visited[tIdx]) {
    return { path: [], cost: null, visited: visitedCount, visitedEdges: [] };
  }

  const path: number[] = [];
  let currentNode = tIdx;

  while (currentNode !== -1) {
    path.unshift(currentNode);
    currentNode = prev[currentNode];
  }

  let cost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    for (let j = 0; j < NEIGH[u].length; j++) {
      if (NEIGH[u][j][0] === v) {
        cost += NEIGH[u][j][1];
        break;
      }
    }
  }

  return { path, cost, visited: visitedCount, visitedEdges: [] };
}

function greedyOnce(sIdx: number, tIdx: number): { path: number[]; cost: number | null; visited: number; visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] } {
  const n = NEIGH.length;
  const visited = new Array(n).fill(false);
  const prev = new Array(n).fill(-1);

  const pq = new MinHeap<{ node: number; h: number }>((a, b) => a.h - b.h);
  pq.push({ node: sIdx, h: 0 });

  visited[sIdx] = true;
  let visitedCount = 0;
  const visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] = [];

  while (!pq.isEmpty()) {
    const { node: u } = pq.pop()!;
    visitedCount++;
    if (prev[u] !== -1) {
      visitedEdges.push({
        from: { lat: COORDS[prev[u]][0], lng: COORDS[prev[u]][1] },
        to: { lat: COORDS[u][0], lng: COORDS[u][1] }
      });
    }

    if (u === tIdx) break;

    for (let j = 0; j < NEIGH[u].length; j++) {
      const v = NEIGH[u][j][0];
      if (!visited[v]) {
        visited[v] = true;
        prev[v] = u;
        const h = haversine(COORDS[v][0], COORDS[v][1], COORDS[tIdx][0], COORDS[tIdx][1]);
        pq.push({ node: v, h });
      }
    }
  }

  if (!visited[tIdx]) {
    return { path: [], cost: null, visited: visitedCount, visitedEdges };
  }

  const path: number[] = [];
  let currentNode = tIdx;

  while (currentNode !== -1) {
    path.unshift(currentNode);
    currentNode = prev[currentNode];
  }

  let cost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    for (let j = 0; j < NEIGH[u].length; j++) {
      if (NEIGH[u][j][0] === v) {
        cost += NEIGH[u][j][1];
        break;
      }
    }
  }

  return { path, cost, visited: visitedCount, visitedEdges };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get('src');
  const dst = searchParams.get('dst');
  const algo = searchParams.get('algo') || 'dijkstra';

  if (!src || !dst) {
    return NextResponse.json(
      { error: 'src and dst query parameters required (format: lat,lon)' },
      { status: 400 }
    );
  }

  try {
    const [sLat, sLon] = src.split(',').map(Number);
    const [dLat, dLon] = dst.split(',').map(Number);

    if (isNaN(sLat) || isNaN(sLon) || isNaN(dLat) || isNaN(dLon)) {
      throw new Error('Invalid coordinates');
    }

    const sIdx = nearest(sLat, sLon);
    const tIdx = nearest(dLat, dLon);

    const t0 = performance.now();
    let result: { path: number[]; cost: number | null; visited: number; visitedEdges: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] };

    switch (algo) {
      case 'astar':
        result = astarOnce(sIdx, tIdx);
        break;
      case 'bfs':
        result = bfsOnce(sIdx, tIdx);
        break;
      case 'dfs':
        result = dfsOnce(sIdx, tIdx);
        break;
      case 'greedy':
        result = greedyOnce(sIdx, tIdx);
        break;
      default:
        result = dijkstraOnce(sIdx, tIdx);
    }

    const dtMs = performance.now() - t0;

    const polyline = result.path.map((i) => ({
      lat: COORDS[i][0],
      lng: COORDS[i][1],
    }));

    return NextResponse.json({
      polyline,
      distance_m: result.cost,
      time_s: null,
      runtime_ms: dtMs,
      visited_nodes: result.visited,
      visited_edges: result.visitedEdges
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid src/dst format. Use: lat,lon' },
      { status: 400 }
    );
  }
}
