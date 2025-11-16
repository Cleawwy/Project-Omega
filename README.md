# Project Omega - Interactive Route Planning Visualizer with Metrics

*Modern Next.js 16 serverless application featuring an interactive Leaflet-based map interface with draggable waypoint markers, real-time algorithm visualization, and side-by-side performance comparisons of Dijkstra vs A\* pathfinding algorithms on Kuala Lumpur's road network.*

---

## 🚀 Features

- **Modular Waypoint System**: Click to place start/end markers, drag to reposition, Shift+Click to add stops
- **Smart Waypoint Management**: Add stops between points automatically, reverse routes, manage multiple waypoints
- **Real-time Algorithm Racing**: Watch Dijkstra vs A* execute simultaneously with live progress bars
- **Algorithm Visualization Dashboard**: Side-by-side performance metrics with animated graphs showing node exploration
- **Efficiency Analytics**: Real-time comparison showing % fewer nodes explored and time saved by A*
  
---

## 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```powershell
git clone <your-repo-url>
cd route_planning
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Run development server

```powershell
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for production

```powershell
npm run build
npm start
```

---

## 📡 API Routes (Serverless)

All API routes are Next.js serverless functions located in `app/api/`:

### `GET /api/route`

Returns the complete route between two points using the specified algorithm.

**Query Parameters:**
- `src`: Start coordinates as `lat,lon` (e.g., `3.1578,101.7117`)
- `dst`: End coordinates as `lat,lon`
- `algo`: Algorithm to use (`dijkstra`, `astar`, `bfs`, `dfs`, `greedy`)

**Response:**
```json
{
  "polyline": [{"lat": 3.1578, "lng": 101.7117}, ...],
  "distance_m": 15234.56,
  "time_s": null,
  "runtime_ms": 245.67,
  "visited_nodes": 1289
}
```

### `GET /api/graph`

Returns the complete graph structure (nodes and edges) for visualization.

**Response:**
```json
{
  "nodes": [{"id": 0, "lat": 3.139, "lng": 101.686}, ...],
  "edges": [{"u": 0, "v": 1, "w": 123.45}, ...]
}
```

### `GET /api/info`

Returns metadata about the loaded graph.

**Response:**
```json
{
  "num_nodes": 142218,
  "num_edges": 382916,
  "graph_type": "real_osm"
}
```

---

## 🗂️ Project Structure

```
route_planning/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Main map interface with waypoint system
│   ├── layout.tsx            # Root layout with fonts
│   ├── globals.css           # Global styles
│   └── api/                  # Serverless API routes
│       ├── route/
│       │   └── route.ts      # Pathfinding algorithm endpoint
│       ├── graph/
│       │   └── route.ts      # Graph data endpoint
│       └── info/
│           └── route.ts      # Graph metadata endpoint
└── src/
     └── data/
        └── kl_graph.json     # 142K node KL road network

```

---

## 🧪 Pathfinding Algorithms

| Algorithm | Status | Description | Performance |
|-----------|--------|-------------|-------------|
| **A*** | ✅ Planned | Heuristic-guided (Haversine) | 40-60% fewer nodes than Dijkstra |
| **Dijkstra** | ✅ Planned | Shortest path guarantee | Explores all directions evenly |
| **BFS** | ✅ Planned | Breadth-first search | Good for unweighted graphs |
| **DFS** | ✅ Planned | Depth-first search | Exploratory, not optimal |
| **Greedy** | ✅ Planned | Best-first with heuristic | Fast but suboptimal |

---

## 🎨 Tech Stack

### Frontend & Backend (Unified)
- **Next.js 16** (Turbopack) - React framework with serverless API routes
- **React 19** - UI library with latest features
- **TypeScript 5** - Type safety across frontend and backend
- **Tailwind CSS 4** - Utility-first styling with new oxide engine
- **Leaflet 1.9.4** - Interactive map library with custom markers
- **Lucide React** - Modern icon library

### Data & Algorithms
- **OpenStreetMap** - Real road network data (via pre-built graph)
- **Haversine Formula** - Great-circle distance for A* heuristic
- **Graph Structure** - Adjacency list with ~380K edges

---

