import { useEffect, useRef } from "react";
import { Location, COVERAGE_BOUNDS } from "@/lib/types";
import "leaflet/dist/leaflet.css";

interface MapProps {
    selectedStart: Location | null;
    selectedDest: Location | null;
    showAllStops: boolean;
    allStopsMarkers: Location[];
    onMapClick: (lat: number, lng: number) => void;
    onMarkerClick: (loc: Location) => void;
    isComparing: boolean;
    algorithmResults?: any[];
    bottomPadding?: number;
    waypoints?: Location[];
    showAllPaths?: boolean;
}

export default function Map({
    selectedStart,
    selectedDest,
    showAllStops,
    allStopsMarkers,
    onMapClick,
    onMarkerClick,
    isComparing,
    algorithmResults = [],
    bottomPadding = 50,
    waypoints = [],
    showAllPaths = false,
}: MapProps & { bottomPadding?: number, waypoints?: Location[], showAllPaths?: boolean }) {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const polylinesRef = useRef<any[]>([]);
    const searchCloudRef = useRef<any[]>([]);
    const lastRenderedCount = useRef(0);

    useEffect(() => {
        const initMap = async () => {
            if (mapRef.current) return;
            const L = (await import("leaflet")).default;

            const container = L.DomUtil.get("map");
            if (container != null) {
                (container as any)._leaflet_id = null;
            }

            const map = L.map("map", {
                maxBounds: [[COVERAGE_BOUNDS.south - 0.1, COVERAGE_BOUNDS.west - 0.1], [COVERAGE_BOUNDS.north + 0.1, COVERAGE_BOUNDS.east + 0.1]],
                maxBoundsViscosity: 1.0,
                minZoom: 10,
                maxZoom: 18,
                dragging: true,
                zoomControl: false,
                scrollWheelZoom: true,
                touchZoom: true,
                doubleClickZoom: true,
                preferCanvas: true, 
            }).setView([3.1390, 101.6869], 14);

            
            const mapContainer = map.getContainer();
            mapContainer.style.touchAction = 'none';
            mapContainer.style.cursor = 'grab';

            const tileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
                attribution: '© OpenStreetMap contributors © CARTO',
                maxZoom: 19,
                noWrap: true,
                keepBuffer: 8,
                updateWhenIdle: false,
                updateWhenZooming: true,
                updateInterval: 100,
                crossOrigin: true,
            }).addTo(map);

            
            map.whenReady(() => {
                setTimeout(() => {
                    map.invalidateSize();
                    tileLayer.redraw();
                }, 100);
            });

            mapRef.current = map;
        };

        initMap();

        
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    
    useEffect(() => {
        const handleResize = () => {
            if (mapRef.current) {
                setTimeout(() => {
                    mapRef.current.invalidateSize();
                }, 100);
            }
        };

        window.addEventListener('resize', handleResize);
        
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 200);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    useEffect(() => {
        const mapInstance = mapRef.current;
        if (!mapInstance) return;

        const handleClick = (e: any) => {
            const { lat, lng } = e.latlng;
            onMapClick(lat, lng);
        };

        mapInstance.on("click", handleClick);

        return () => {
            mapInstance.off("click", handleClick);
        };
    }, [onMapClick]);

    useEffect(() => {
        const mapInstance = mapRef.current;
        if (!mapInstance) return;

        
        if (mapInstance.dragging) mapInstance.dragging.enable();
        if (mapInstance.touchZoom) mapInstance.touchZoom.enable();
        if (mapInstance.doubleClickZoom) mapInstance.doubleClickZoom.enable();
        if (mapInstance.scrollWheelZoom) mapInstance.scrollWheelZoom.enable();
        if (mapInstance.boxZoom) mapInstance.boxZoom.enable();
        if (mapInstance.keyboard) mapInstance.keyboard.enable();
        if (mapInstance.tap) mapInstance.tap.enable();
    }, [isComparing, selectedStart, selectedDest]);

    
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !algorithmResults) return;

        const animatePath = async () => {
            const L = (await import("leaflet")).default;

            
            if (algorithmResults.length === 0) {
                polylinesRef.current.forEach(p => p.remove());
                polylinesRef.current = [];
                searchCloudRef.current.forEach(m => m.remove());
                searchCloudRef.current = [];
                lastRenderedCount.current = 0;
                return;
            }

            
            if (showAllPaths) {
                
                polylinesRef.current.forEach(p => p.remove());
                polylinesRef.current = [];
                searchCloudRef.current.forEach(m => m.remove());
                searchCloudRef.current = [];

                algorithmResults.forEach(result => {
                    if (!result.path || result.path.length === 0) return;

                    let color = "#00ff00";
                    if (result.name === "Dijkstra") color = "#3b82f6"; 
                    else if (result.name === "A*") color = "#10b981"; 
                    else if (result.name === "BFS") color = "#f59e0b"; 
                    else if (result.name === "Greedy") color = "#a855f7"; 

                    const pathPoints = result.path.map((p: any) => [p.lat, p.lng]);

                    
                    const glowPolyline = L.polyline(pathPoints, {
                        color: color,
                        weight: 8,
                        opacity: 0.4,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }).addTo(map);
                    polylinesRef.current.push(glowPolyline);

                    
                    const polyline = L.polyline(pathPoints, {
                        color: color,
                        weight: 4,
                        opacity: 1.0,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }).addTo(map);
                    polylinesRef.current.push(polyline);
                });
                return;
            }

            
            const newResults = algorithmResults.slice(lastRenderedCount.current);
            if (newResults.length === 0) return;

            
            polylinesRef.current.forEach(p => p.remove());
            polylinesRef.current = [];
            searchCloudRef.current.forEach(m => m.remove());
            searchCloudRef.current = [];

            for (const result of newResults) {
                
                if ((result.name === "Dijkstra" || result.name === "A*") && result.visitedEdges && result.visitedEdges.length > 0) {
                    const edges = result.visitedEdges;

                    const treePolyline = L.polyline([], {
                        color: result.name === "Dijkstra" ? "#3b82f6" : "#10b981",
                        weight: 1,
                        opacity: 0.5,
                        renderer: L.canvas() 
                    }).addTo(map);
                    searchCloudRef.current.push(treePolyline);

                    
                    
                    
                    const batchSize = Math.min(2000, Math.max(50, Math.ceil(edges.length / 60)));

                    let i = 0;
                    await new Promise<void>(resolve => {
                        const allSegments: any[] = [];
                        const runAnimation = () => {
                            const limit = i + batchSize;
                            while (i < limit && i < edges.length) {
                                const edge = edges[i];
                                allSegments.push([[edge.from.lat, edge.from.lng], [edge.to.lat, edge.to.lng]]);
                                i++;
                            }

                            treePolyline.setLatLngs(allSegments);

                            if (i < edges.length) {
                                requestAnimationFrame(runAnimation);
                            } else {
                                resolve();
                            }
                        }
                        runAnimation();
                    });
                }

                if (!result.path || result.path.length === 0) continue;

                let color = "#00ff00";
                if (result.name === "Dijkstra") color = "#3b82f6"; 
                else if (result.name === "A*") color = "#10b981"; 
                else if (result.name === "BFS") color = "#f59e0b"; 
                else if (result.name === "Greedy") color = "#a855f7"; 

                const pathPoints = result.path.map((p: any) => [p.lat, p.lng]);

                
                const glowPolyline = L.polyline([], {
                    color: color,
                    weight: 8,
                    opacity: 0.4,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map);
                polylinesRef.current.push(glowPolyline);

                const polyline = L.polyline([], {
                    color: color,
                    weight: 4,
                    opacity: 1.0,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map);
                polylinesRef.current.push(polyline);

                
                let j = 0;
                const animate = () => {
                    
                    
                    const pathBatch = Math.max(1, Math.ceil(pathPoints.length / 60));

                    for (let k = 0; k < pathBatch && j < pathPoints.length; k++) {
                        polyline.addLatLng(pathPoints[j]);
                        glowPolyline.addLatLng(pathPoints[j]);
                        j++;
                    }

                    if (j < pathPoints.length) {
                        requestAnimationFrame(animate);
                    }
                };
                animate();
            }

            lastRenderedCount.current = algorithmResults.length;
        };

        animatePath();
    }, [algorithmResults, showAllPaths]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const renderMarkers = async () => {
            const L = (await import("leaflet")).default;
            markersRef.current.forEach((m) => m.remove());
            markersRef.current = [];

            const createMarker = (loc: Location, color: string, scale: number = 1, interactive: boolean = false) => {
                const size = 32 * scale;
                const height = 40 * scale;
                const icon = L.divIcon({
                    html: `<svg width="${size}" height="${height}" viewBox="0 0 32 40" class="${interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} filter drop-shadow-lg"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="${color}"/><circle cx="16" cy="16" r="6" fill="#000"/></svg>`,
                    className: '',
                    iconSize: [size, height],
                    iconAnchor: [size / 2, height],
                });
                const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

                if (interactive) {
                    marker.on('click', () => {
                        onMarkerClick(loc);
                    });
                }

                return marker;
            };

            if (showAllStops && allStopsMarkers.length > 0) {
                allStopsMarkers.forEach(stop => {
                    const isSelected = selectedDest && stop.lat === selectedDest.lat && stop.lng === selectedDest.lng;
                    if (!isSelected) {
                        const color = selectedStart ? '#8b5cf6' : '#ef4444';
                        markersRef.current.push(createMarker(stop, color, 0.8, !isComparing));
                    }
                });
            }

            
            waypoints.forEach((wp, idx) => {
                markersRef.current.push(createMarker(wp, '#6b7280', 1.0, false)); 
            });

            if (selectedStart) markersRef.current.push(createMarker(selectedStart, '#10b981', 1.2, false));
            if (selectedDest) markersRef.current.push(createMarker(selectedDest, '#ef4444', 1.2, false));

            if (selectedStart && !selectedDest && map && waypoints.length === 0) {
                map.flyTo([selectedStart.lat, selectedStart.lng], 16, {
                    animate: true,
                    duration: 2.0,
                    easeLinearity: 0.25
                });
            } else if ((selectedStart || selectedDest || waypoints.length > 0) && map && !isComparing) {
                const points: [number, number][] = [];
                if (selectedStart) points.push([selectedStart.lat, selectedStart.lng]);
                if (selectedDest) points.push([selectedDest.lat, selectedDest.lng]);
                waypoints.forEach(wp => points.push([wp.lat, wp.lng]));

                if (points.length > 0) {
                    const bounds = L.latLngBounds(points);
                    map.fitBounds(bounds, {
                        paddingTopLeft: [50, 50],
                        paddingBottomRight: [50, bottomPadding],
                        maxZoom: 15,
                        duration: 2.0,
                        animate: true
                    });
                }
            }
        };

        renderMarkers();
    }, [selectedStart, selectedDest, showAllStops, allStopsMarkers, bottomPadding, waypoints]);

    return <div id="map" className="w-full h-full z-0" style={{ pointerEvents: 'auto' }} />;
}
