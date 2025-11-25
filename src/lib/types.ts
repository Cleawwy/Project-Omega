export type LatLng = { lat: number; lng: number };

export type Location = { name: string; lat: number; lng: number };

export type RouteResp = {
  polyline: LatLng[];
  distance_m: number | null;
  time_s: number | null;
  runtime_ms: number | null;
  visited_nodes: number | null;
};

export type LiveProgress = { points: number; total: number; complete: boolean };

export const COVERAGE_BOUNDS = {
  north: 3.4,
  south: 2.8,
  east: 102.1,
  west: 101.3,
};
