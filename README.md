# Route Planning Visualizer

*Next.js + React 19 + TypeScript + Tailwind CSS frontend with Leaflet maps, backed by a FastAPI + Uvicorn Python microservice using NumPy for graph-based route planning (Dijkstra/A\*/BFS/DFS/Greedy), OSMnx for OpenStreetMap data, and NDJSON streaming for real-time algorithm visualization.*

---

## 🚀 Features

- **Interactive Map Interface**: Leaflet-based map with click-to-select start/end points
- **Multiple Algorithms**: Dijkstra, A*, BFS, DFS, and Greedy search implementations
- **Real-time Visualization**: NDJSON streaming endpoint for step-by-step algorithm execution
- **Real Road Network**: Uses OpenStreetMap data via OSMnx for accurate route planning
- **Performance Metrics**: Runtime tracking, visited nodes count, and distance calculations
- **Smooth Animations**: Framer Motion for polished UI transitions

---

## 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.8+ recommended)
- **npm** or **yarn**

---

## 🛠️ Installation

### 1. Clone the repository

```powershell
git clone <your-repo-url>
cd route_planning
```

### 2. Install frontend dependencies

```powershell
npm install
```

### 3. Install backend dependencies

```powershell
cd api
pip install -r requirements.txt
```

### 4. Build the road network graph (optional but recommended)

The project includes a toy graph by default. For real road network data:

```powershell
cd api
python build_graph.py
```

This will download OpenStreetMap data for Kuala Lumpur and generate `kl_graph.json` in the `api/data/` directory.

---

## 🏃 Running the Application

### Start the Backend API

```powershell
cd api
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Start the Frontend

In a new terminal:

```powershell
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 📡 API Endpoints

### `GET /route`

Returns the complete route between two points.

**Query Parameters:**
- `src`: Start coordinates as `lat,lon` (e.g., `3.139,101.686`)
- `dst`: End coordinates as `lat,lon`
- `algo`: Algorithm to use (`dijkstra`, `astar`, `bfs`, `dfs`, `greedy`)

**Response:**
```json
{
  "polyline": [{"lat": 3.139, "lng": 101.686}, ...],
  "distance_m": 1234.56,
  "time_s": null,
  "runtime_ms": 45.67,
  "visited_nodes": 89
}
```

### `GET /run`

Streaming NDJSON endpoint for real-time algorithm visualization.

**Query Parameters:** Same as `/route`

**Response:** NDJSON stream with `type: "start"`, `type: "step"`, `type: "done"` events

### `GET /graph`

Returns the complete graph structure (nodes and edges).

### `GET /info`

Returns metadata about the loaded graph (node count, edge count, graph type).

---

## 🗂️ Project Structure

```
route_planning/
├── api/                       # Python FastAPI backend
│   ├── main.py               # Main API server
│   ├── algorithms_stream.py  # Graph algorithm implementations
│   ├── build_graph.py        # OSMnx graph builder
│   ├── download_roads.py     # Road network downloader
│   ├── generate_grid.py      # Toy graph generator
│   ├── requirements.txt      # Python dependencies
│   ├── data/                 # Graph data files
│   └── cache/                # API response cache
├── app/                      # Next.js pages
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── public/                   # Static assets
├── package.json              # Node.js dependencies
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

---

## 🧪 Available Algorithms

| Algorithm | Description | Use Case |
|-----------|-------------|----------|
| **Dijkstra** | Shortest path with uniform cost | Guaranteed optimal path |
| **A*** | Heuristic-guided search | Faster than Dijkstra with good heuristic |
| **BFS** | Breadth-first search | Unweighted shortest path |
| **DFS** | Depth-first search | Exploratory, not optimal |
| **Greedy** | Always move closer to goal | Fast but not optimal |

---

## 🎨 Tech Stack

### Frontend
- **Next.js 16** - React framework with SSR/SSG
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Leaflet** - Interactive maps
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **NumPy** - Numerical computing
- **OSMnx** - OpenStreetMap network analysis
- **NetworkX** - Graph data structures

---

## 🔧 Development

### Build for production

```powershell
npm run build
npm run start
```

### Linting

```powershell
npm run lint
```

---

## 📝 Notes

- The backend uses CORS middleware to allow frontend requests from any origin
- Graph data is cached in JSON format for fast loading
- The nearest node to clicked coordinates is automatically selected
- All algorithms return visited node counts for performance comparison

---
