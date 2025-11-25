import { motion } from "framer-motion";
import { Clock, Zap, Route, Activity } from "lucide-react";

interface AlgorithmResult {
    name: string;
    distance: string;
    time: string;
    nodesVisited: number;
    efficiency: string;
}

interface AlgorithmComparisonProps {
    results: AlgorithmResult[];
    isComparing: boolean;
    currentAlgorithm: string;
    onClose: () => void;
    embedded?: boolean;
}

export default function AlgorithmComparison({
    results,
    isComparing,
    currentAlgorithm,
    onClose,
    embedded = false,
    sidePanel = false,
}: AlgorithmComparisonProps & { sidePanel?: boolean }) {
    if (!isComparing && results.length === 0 && !embedded) return null;

    const algoColors: Record<string, string> = {
        "Dijkstra": "bg-blue-500",
        "A*": "bg-emerald-500",
        "BFS": "bg-amber-500",
        "Greedy": "bg-purple-500"
    };

    
    const fastestTime = Math.min(...results.map(r => parseFloat(r.time) || Infinity));

    return (
        <motion.div
            initial={embedded ? { opacity: 0 } : sidePanel ? { opacity: 0, x: -50 } : { opacity: 0, x: 100 }}
            animate={embedded ? { opacity: 1 } : sidePanel ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            exit={embedded ? { opacity: 0 } : sidePanel ? { opacity: 0, x: -50 } : { opacity: 0, x: 100 }}
            className={embedded
                ? "w-full h-full bg-gray-950 overflow-hidden flex flex-col"
                : sidePanel
                    ? "fixed top-1/2 -translate-y-1/2 left-[calc(50%+220px)] w-96 h-[600px] bg-gray-950/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[1000]"
                    : "absolute top-4 right-4 w-80 bg-gray-950/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[1000]"
            }
        >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 flex-shrink-0">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    Technical Analysis
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none px-2"
                >
                    ×
                </button>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                {currentAlgorithm && (
                    <div className="p-3 bg-blue-900/30 rounded-xl border border-blue-700 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-medium text-blue-300">Running {currentAlgorithm}...</span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {results.map((res, idx) => {
                        const isFastest = parseFloat(res.time) === fastestTime;

                        return (
                            <motion.div
                                key={res.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-4 rounded-xl border ${res.name === currentAlgorithm ? "border-blue-500 bg-gray-800" : "border-gray-700 bg-gray-900"}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${algoColors[res.name] || "bg-gray-500"}`} />
                                        <h3 className="font-bold text-lg text-white">{res.name}</h3>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${res.efficiency === "Optimal Path" ? "bg-green-100 text-green-700" :
                                        "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {res.efficiency}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">Distance</p>
                                        <p className="font-semibold text-white">{res.distance} km</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Time</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-white">{res.time} ms</p>
                                            {isFastest && (
                                                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                                    Fastest
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Visited</p>
                                        <p className="font-semibold text-white">{res.nodesVisited}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

            </div>
        </motion.div>
    );
}
