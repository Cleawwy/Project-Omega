import { MapPin, Navigation, Play, ArrowRightLeft, Menu } from "lucide-react";
import { Location } from "@/lib/types";
import SearchInput from "./SearchInput";
import QuickActions from "./QuickActions";
import { useState, useEffect } from "react";

interface SidebarProps {
    selectedStart: Location | null;
    selectedDest: Location | null;
    waypoints?: Location[];
    onSelectStart: (loc: Location | null) => void;
    onSelectDest: (loc: Location | null) => void;
    onUpdateWaypoint?: (index: number, loc: Location) => void;
    onRemoveWaypoint?: (index: number) => void;
    onSwap: () => void;
    onCurrentLocation: () => void;
    onCompare: () => void;
    onQuickAction: (mode: "nearest-hospital" | "nearest-station" | "nearest-bus") => void;
    onAddWaypoint?: () => void;
    suggestions: Location[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchMode: "start" | "dest" | number;
    setSearchMode: (mode: "start" | "dest" | number) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    viewMode: "mobile" | "desktop";
    visible?: boolean;
}

export default function Sidebar({
    selectedStart,
    selectedDest,
    waypoints = [],
    onSelectStart,
    onSelectDest,
    onUpdateWaypoint,
    onRemoveWaypoint,
    onSwap,
    onCurrentLocation,
    onCompare,
    onQuickAction,
    onAddWaypoint,
    suggestions,
    searchQuery,
    setSearchQuery,
    searchMode,
    setSearchMode,
    showDropdown,
    setShowDropdown,
    viewMode,
    visible = true,
}: SidebarProps) {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowDropdown]);

    if (viewMode === "mobile") {
        return (
            <div
                className={`absolute bottom-0 left-0 w-full z-20 p-4 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] search-container transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}`}
                onMouseEnter={() => visible || (window as any).showSidebar?.()}
                onMouseLeave={() => (window as any).hideSidebar?.()}
            >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <div className="space-y-4">
                    <SearchInput
                        placeholder="Where from?"
                        value={searchMode === "start" && showDropdown ? searchQuery : (selectedStart?.name || "")}
                        onChange={(val) => {
                            setSearchQuery(val);
                            setShowDropdown(val.length > 0);
                            setSearchMode("start");
                        }}
                        onFocus={() => {
                            setSearchMode("start");
                            setSearchQuery("");
                            setShowDropdown(false);
                        }}
                        onClear={() => onSelectStart(null)}
                        onSelect={(loc) => {
                            onSelectStart(loc);
                            setSearchQuery("");
                            setShowDropdown(false);
                        }}
                        suggestions={suggestions}
                        showSuggestions={searchMode === "start" && showDropdown}
                        icon={<MapPin className="w-4 h-4 text-green-500" />}
                        rightElement={
                            <button
                                onClick={onCurrentLocation}
                                className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-all"
                            >
                                <Navigation className="w-4 h-4" />
                            </button>
                        }
                    />

                    <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                        <button
                            onClick={onSwap}
                            className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-black hover:shadow-md transition-all shadow-sm pointer-events-auto"
                        >
                            <ArrowRightLeft className="w-4 h-4" />
                        </button>
                    </div>

                    {waypoints.length > 0 && waypoints.map((waypoint, index) => (
                        <div key={index}>
                            <SearchInput
                                placeholder={`Stop ${index + 1}`}
                                value={searchMode === index && showDropdown ? searchQuery : (waypoint?.name || "")}
                                onChange={(val) => {
                                    setSearchQuery(val);
                                    setShowDropdown(val.length > 0);
                                    setSearchMode(index);
                                }}
                                onFocus={() => {
                                    setSearchMode(index);
                                    setSearchQuery("");
                                    setShowDropdown(false);
                                }}
                                onClear={() => onRemoveWaypoint?.(index)}
                                onSelect={(loc) => {
                                    onUpdateWaypoint?.(index, loc);
                                    setSearchQuery("");
                                    setShowDropdown(false);
                                }}
                                suggestions={suggestions}
                                showSuggestions={searchMode === index && showDropdown}
                                icon={<MapPin className="w-4 h-4 text-blue-500" />}
                            />
                            <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                                <button
                                    onClick={onSwap}
                                    className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-black hover:shadow-md transition-all shadow-sm pointer-events-auto"
                                >
                                    <ArrowRightLeft className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <SearchInput
                        placeholder="Where to?"
                        value={searchMode === "dest" && showDropdown ? searchQuery : (selectedDest?.name || "")}
                        onChange={(val) => {
                            setSearchQuery(val);
                            setShowDropdown(val.length > 0);
                            setSearchMode("dest");
                        }}
                        onFocus={() => {
                            setSearchMode("dest");
                            setSearchQuery("");
                            setShowDropdown(false);
                        }}
                        onClear={() => onSelectDest(null)}
                        onSelect={(loc) => {
                            onSelectDest(loc);
                            setSearchQuery("");
                            setShowDropdown(false);
                        }}
                        suggestions={suggestions}
                        showSuggestions={searchMode === "dest" && showDropdown}
                        icon={<MapPin className="w-4 h-4 text-red-500" />}
                    />

                    {selectedStart && (
                        <div className="pt-2 space-y-2">
                            <QuickActions
                                onAction={onQuickAction}
                                onAddStop={waypoints.length === 0 ? onAddWaypoint : undefined}
                            />
                            {waypoints.length > 0 && (
                                <button
                                    onClick={() => onRemoveWaypoint?.(0)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    <span className="text-xs font-medium">Remove Stop</span>
                                </button>
                            )}
                        </div>
                    )}                    <button
                        onClick={onCompare}
                        disabled={!selectedStart || !selectedDest}
                        className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all shadow-lg active:scale-[0.98] ${selectedStart && selectedDest
                            ? "bg-black hover:bg-gray-900 shadow-black/20"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {selectedStart && selectedDest ? "Book Ride" : "Select Locations"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`absolute top-4 left-4 z-[1000] transition-all duration-500 ease-in-out pointer-events-none ${isHovered ? "w-96" : "w-12 h-12 overflow-hidden"
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-500 pointer-events-auto ${isHovered ? "p-4" : "p-0 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 cursor-pointer"
                }`}>
                {!isHovered ? (
                    <Menu className="w-6 h-6 text-white" />
                ) : (
                    <div className="space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Route Planning</h2>
                        </div>

                        <SearchInput
                            placeholder="Start"
                            value={searchMode === "start" && showDropdown ? searchQuery : (selectedStart?.name || "")}
                            onChange={(val) => {
                                setSearchQuery(val);
                                if (!showDropdown) setShowDropdown(true);
                                if (searchMode !== "start") setSearchMode("start");
                            }}
                            onFocus={() => {
                                setSearchMode("start");
                                setSearchQuery("");
                                setShowDropdown(true);
                            }}
                            onClear={() => onSelectStart(null)}
                            onSelect={(loc) => {
                                onSelectStart(loc);
                                setSearchQuery("");
                                setShowDropdown(false);
                            }}
                            suggestions={suggestions}
                            showSuggestions={searchMode === "start" && showDropdown}
                            icon={<MapPin className="w-4 h-4 text-green-500" />}
                        />

                        <div className="flex justify-center -my-2 relative z-10 pointer-events-none">
                            <button
                                onClick={onSwap}
                                className="p-1.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-black hover:scale-110 transition-all shadow-sm pointer-events-auto"
                            >
                                <ArrowRightLeft className="w-3 h-3" />
                            </button>
                        </div>

                        <SearchInput
                            placeholder="Destination"
                            value={searchMode === "dest" && showDropdown ? searchQuery : (selectedDest?.name || "")}
                            onChange={(val) => {
                                setSearchQuery(val);
                                if (!showDropdown) setShowDropdown(true);
                                if (searchMode !== "dest") setSearchMode("dest");
                            }}
                            onFocus={() => {
                                setSearchMode("dest");
                                setSearchQuery("");
                                setShowDropdown(true);
                            }}
                            onClear={() => onSelectDest(null)}
                            onSelect={(loc) => {
                                onSelectDest(loc);
                                setSearchQuery("");
                                setShowDropdown(false);
                            }}
                            suggestions={suggestions}
                            showSuggestions={searchMode === "dest" && showDropdown}
                            icon={<MapPin className="w-4 h-4 text-red-500" />}
                        />

                        {selectedStart && selectedDest && (
                            <button
                                onClick={onCompare}
                                className="w-full mt-2 bg-black text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-gray-900 active:scale-[0.98]"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Re-Run Analysis
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
