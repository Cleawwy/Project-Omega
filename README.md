> ## 📍 Project Omega — Route Planning Visualizer
> Interactive route-planning tool built with Next.js. Lets you place waypoints on a Leaflet map, compare Dijkstra and A* side-by-side, and visualize how each algorithm explores Kuala Lumpur’s road network.
>
> ---
> ### 🚀 Features
> - Place start/end points with clicks; drag to move; Shift+Click to add stops  
> - Auto-managed waypoint ordering and route reversal  
> - Live comparison of Dijkstra vs A* with progress indicators  
> - Exploration metrics: runtime, nodes visited, distance  
> - Graph viewer showing KL’s OSM-based node/edge structure
>
> ---
> ### 📦 Requirements
> - Node.js 18+
> - npm or yarn
>
> ---
> ### 🛠️ Setup
> 1. Clone the repo  
> ```bash
> git clone <your-repo-url>
> cd route_planning
> ```
> 2. Install deps  
> ```bash
> npm install
> ```
> 3. Start dev server  
> ```bash
> npm run dev
> ```
> App runs at **http://localhost:3000**
>
> 4. Production build  
> ```bash
> npm run build
> npm start
> ```
>
> ---
> ### 📡 API Endpoints
> **GET /api/route**  
> Returns a route using the selected algorithm.  
> Params:  
> - `src` — `"lat,lon"`  
> - `dst` — `"lat,lon"`  
> - `algo` — `dijkstra | astar | bfs | dfs | greedy`
>
> **GET /api/graph**  
> Returns all nodes and edges.
>
> **GET /api/info**  
> Basic metadata: number of nodes, edges, graph type.
>
> ---
> ### 📂 Structure
> ```
> route_planning/
> ├── app/
> │   ├── page.tsx
> │   ├── layout.tsx
> │   ├── globals.css
> │   └── api/
> └── src/data/kl_graph.json
> ```
>
> ---
> ### 🔍 Algorithms
> - **A\*** — heuristic-guided, fewer explored nodes  
> - **Dijkstra** — guaranteed shortest path  
> - **BFS / DFS** — basic traversals  
> - **Greedy** — fast, not optimal
>
> ---
> ### 🧰 Tech Stack
> - Next.js 16 (App Router)
> - React 19
> - TypeScript
> - Tailwind CSS
> - Leaflet
> - OpenStreetMap graph (142k nodes, 380k edges)
>
> ---
