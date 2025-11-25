import { Hospital, Train, Bus, Plus } from "lucide-react";

interface QuickActionsProps {
    onAction: (mode: "nearest-hospital" | "nearest-station" | "nearest-bus") => void;
    onAddStop?: () => void;
}

export default function QuickActions({ onAction, onAddStop }: QuickActionsProps) {
    return (
        <div className="flex gap-2 justify-center animate-in fade-in slide-in-from-top-4 duration-300">
            <button
                onClick={() => onAction("nearest-hospital")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
                title="Find nearest hospital"
            >
                <Hospital className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Hospital</span>
            </button>

            <button
                onClick={() => onAction("nearest-station")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
                title="Find nearest train station"
            >
                <Train className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Station</span>
            </button>

            {onAddStop && (
                <button
                    onClick={onAddStop}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
                    title="Add waypoint"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Add Stop</span>
                </button>
            )}
        </div>
    );
}
