"use client";

import { useState } from "react";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import AlgorithmComparison from "@/components/AlgorithmComparison";
import IPhoneHome from "@/components/IPhoneHome";
import PerformanceGraphs from "@/components/PerformanceGraphs";
import { Location, COVERAGE_BOUNDS } from "@/lib/types";
import { PRESET_LOCATIONS } from "@/data/locations";


export default function Page() {
  const [viewMode, setViewMode] = useState<"home" | "booking" | "desktop">("home");
  const [selectedStart, setSelectedStart] = useState<Location | null>(null);
  const [selectedDest, setSelectedDest] = useState<Location | null>(null);
  const [waypoints, setWaypoints] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchMode, setSearchMode] = useState<"start" | "dest" | number>("start");
  const [isComparing, setIsComparing] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>("");
  const [algorithmResults, setAlgorithmResults] = useState<any[]>([]);
  const [showAllStops, setShowAllStops] = useState(false);
  const [allStopsMarkers, setAllStopsMarkers] = useState<Location[]>([]);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  
  if (typeof window !== 'undefined') {
    (window as any).showSidebar = () => setSidebarVisible(true);
    (window as any).hideSidebar = () => setSidebarVisible(false);
  }

  const currentLocations = PRESET_LOCATIONS;
  const currentBounds = COVERAGE_BOUNDS;

  const suggestions = searchQuery.length > 0 ? currentLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    loc.name !== selectedStart?.name &&
    loc.name !== selectedDest?.name
  ).slice(0, 8) : [];

  const handleMapClick = (lat: number, lng: number) => {
    if (isComparing) return;
    if (lat < currentBounds.south || lat > currentBounds.north || lng < currentBounds.west || lng > currentBounds.east) return;

    setSidebarVisible(true);

    if (!selectedStart) {
      setSelectedStart({ name: `Start (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng });
    } else if (!selectedDest) {
      setSelectedDest({ name: `End (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng });
    } else {
      
      setSelectedDest({ name: `End (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng });
    }
  };

  const handleAddWaypoint = () => {
    let lat = 0;
    let lng = 0;
    let name = "New Stop";

    if (selectedStart && selectedDest) {
      
      lat = (selectedStart.lat + selectedDest.lat) / 2;
      lng = (selectedStart.lng + selectedDest.lng) / 2;
      name = `Stop (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    } else if (selectedStart) {
      
      lat = selectedStart.lat + 0.005;
      lng = selectedStart.lng + 0.005;
      name = `Stop (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    } else {
      
      lat = 3.1390;
      lng = 101.6869;
    }

    const newWaypoint: Location = {
      name,
      lat,
      lng
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude >= currentBounds.south && latitude <= currentBounds.north &&
            longitude >= currentBounds.west && longitude <= currentBounds.east) {
            setSelectedStart({
              name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              lat: latitude,
              lng: longitude
            });
          } else {
            alert("Your current location is outside the coverage area (Kuala Lumpur)");
          }
        },
        (error) => {
          alert("Unable to get your location. Please enable location services.");
        }
      );
    }
  };

  const handleCompare = async () => {
    if (!selectedStart || !selectedDest) return;

    setIsComparing(true);
    setSidebarVisible(false); 
    setAlgorithmResults([]);
    setShowAllPaths(false);

    const algorithms = ["dijkstra", "astar", "bfs", "greedy"];
    const algoNames = ["Dijkstra", "A*", "BFS", "Greedy"];

    let dijkstraDistance = 0;

    for (let i = 0; i < algorithms.length; i++) {
      const algo = algorithms[i];
      const algoName = algoNames[i];

      setCurrentAlgorithm(algoName);

      try {
        const response = await fetch(
          `/api/route?src=${selectedStart.lat},${selectedStart.lng}&dst=${selectedDest.lat},${selectedDest.lng}&algo=${algo}&region=KL`
        );
        const data = await response.json();

        const distance = data.distance_m ? (data.distance_m / 1000) : 0;

        
        if (algo === "dijkstra") {
          dijkstraDistance = distance;
        }

        
        
        const isOptimal = dijkstraDistance > 0 && distance <= dijkstraDistance * 1.001;

        setAlgorithmResults(prev => [...prev, {
          name: algoName,
          distance: distance.toFixed(2),
          time: data.runtime_ms ? data.runtime_ms.toFixed(2) : "N/A",
          nodesVisited: data.visited_nodes || 0,
          efficiency: isOptimal ? "Optimal Path" : "Sub-optimal Path",
          path: data.polyline,
          visitedEdges: data.visited_edges || []
        }]);

        
        if (algo === "dijkstra" || algo === "astar") {
          await new Promise(resolve => setTimeout(resolve, 4000)); 
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        }

      } catch (error) {
        console.error(`Error running ${algoName}:`, error);
        setAlgorithmResults(prev => [...prev, {
          name: algoName,
          distance: "Error",
          time: "Error",
          nodesVisited: 0,
          efficiency: "Error",
          path: [],
          visitedEdges: []
        }]);
      }
    }

    setCurrentAlgorithm("");

    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowAllPaths(true);
  };

  const handleQuickAction = (mode: "nearest-hospital" | "nearest-station" | "nearest-bus") => {
    if (!selectedStart) {
      alert("Please select a starting point first");
      return;
    }

    let filterLocations: Location[] = [];

    if (mode === "nearest-hospital") {
      filterLocations = currentLocations.filter(loc => loc.name.toLowerCase().includes("hospital"));
    } else if (mode === "nearest-station") {
      filterLocations = currentLocations.filter(loc =>
        loc.name.toLowerCase().includes("station") ||
        loc.name.toLowerCase().includes("lrt") ||
        loc.name.toLowerCase().includes("train")
      );
    }

    if (filterLocations.length > 0) {
      
      setShowAllStops(true);
      setAllStopsMarkers(filterLocations);
    }
  };

  return (
    <>
      {/* White background overlay */}
      {viewMode === "home" && (
        <div className="fixed inset-0 bg-white z-5" />
      )}

      {/* iPhone frame on top */}
      <div className={`iphone-container ${viewMode === "desktop" ? "desktop-mode" : "iphone-mode"}`}>
        <div className="dynamic-island" />

        {viewMode === "home" ? (
          <IPhoneHome onOpenApp={() => setViewMode("booking")} />
        ) : (
          <div className={`w-full h-full flex ${viewMode === "desktop" ? "flex-row" : "flex-col"}`}>
            <div className={`relative ${viewMode === "desktop" ? "w-1/2 h-full border-r border-gray-200" : "w-full h-full"}`}>
              {/* Map is now always inside this container for both mobile and desktop views */}
              <div className="absolute inset-0 z-0">
                <Map
                  selectedStart={selectedStart}
                  selectedDest={selectedDest}
                  showAllStops={showAllStops}
                  allStopsMarkers={allStopsMarkers}
                  onMapClick={handleMapClick}
                  onMarkerClick={(loc) => {
                    setSelectedDest(loc);
                    setShowAllStops(false);
                  }}
                  isComparing={isComparing}
                  algorithmResults={algorithmResults}
                  bottomPadding={viewMode !== "desktop" ? 350 : 50}
                  waypoints={waypoints}
                  showAllPaths={showAllPaths}
                />
              </div>

              <Sidebar
                selectedStart={selectedStart}
                selectedDest={selectedDest}
                waypoints={waypoints}
                onSelectStart={setSelectedStart}
                onSelectDest={setSelectedDest}
                onUpdateWaypoint={(index, loc) => {
                  const newWaypoints = [...waypoints];
                  newWaypoints[index] = loc;
                  setWaypoints(newWaypoints);
                }}
                onRemoveWaypoint={(index) => {
                  setWaypoints(waypoints.filter((_, i) => i !== index));
                }}
                onSwap={() => {
                  const temp = selectedStart;
                  setSelectedStart(selectedDest);
                  setSelectedDest(temp);
                }}
                onCurrentLocation={getCurrentLocation}
                onCompare={handleCompare}
                onQuickAction={handleQuickAction}
                onAddWaypoint={handleAddWaypoint}
                suggestions={suggestions}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchMode={searchMode}
                setSearchMode={setSearchMode}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                viewMode={viewMode === "desktop" ? "desktop" : "mobile"}
                visible={sidebarVisible && !isComparing}
              />
            </div>

            {viewMode === "desktop" && (
              <div className="w-1/2 h-full bg-white">
                <AlgorithmComparison
                  results={algorithmResults}
                  isComparing={isComparing}
                  currentAlgorithm={currentAlgorithm}
                  onClose={() => {
                    setIsComparing(false);
                    setAlgorithmResults([]);
                    setCurrentAlgorithm("");
                    setViewMode("booking");
                  }}
                  embedded={true}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Technical Analysis Side Panel */}
      {viewMode !== "desktop" && (
        <AlgorithmComparison
          results={algorithmResults}
          isComparing={isComparing}
          currentAlgorithm={currentAlgorithm}
          onClose={() => {
            setIsComparing(false);
            setAlgorithmResults([]);
            setCurrentAlgorithm("");
          }}
          sidePanel={true}
        />
      )}

      {/* Performance Graphs Side Panel (Left) */}
      {viewMode !== "desktop" && (
        <PerformanceGraphs
          results={algorithmResults}
          visible={isComparing || algorithmResults.length > 0}
        />
      )}
    </>
  );
}
