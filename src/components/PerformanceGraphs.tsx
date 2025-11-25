import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface AlgorithmResult {
    name: string;
    distance: string;
    time: string;
    nodesVisited: number;
    efficiency: string;
}

interface PerformanceGraphsProps {
    results: AlgorithmResult[];
    visible: boolean;
}

export default function PerformanceGraphs({ results, visible }: PerformanceGraphsProps) {
    if (!visible && results.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-1/2 -translate-y-1/2 right-[calc(50%+220px)] w-80 bg-gray-950/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[1000]"
        >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 flex-shrink-0">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    Performance Analysis
                </h2>
            </div>

            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                    {/* Execution Time Graph */}
                    <div className="bg-gray-900 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-3">Execution Time (ms)</p>
                        <div className="relative h-40">
                            {/* Y-axis */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                                <span>{Math.max(...results.map(r => parseFloat(r.time === "Error" ? "0" : r.time))).toFixed(1)}</span>
                                <span>0</span>
                            </div>
                            {/* Graph area */}
                            <div className="ml-8 h-full relative border-l border-b border-gray-700">
                                {/* Grid lines */}
                                <div className="absolute inset-0">
                                    {[0, 25, 50, 75, 100].map(pct => (
                                        <div key={pct} className="absolute w-full border-t border-gray-800" style={{ bottom: `${pct}%` }} />
                                    ))}
                                </div>
                                {/* Data points and lines */}
                                <svg className="absolute inset-0 w-full h-full">
                                    {results.map((res, idx) => {
                                        const maxTime = Math.max(...results.map(r => parseFloat(r.time === "Error" ? "0" : r.time)));
                                        const x = ((idx + 0.5) / results.length) * 100;
                                        const y = 100 - (parseFloat(res.time === "Error" ? "0" : res.time) / maxTime * 100);
                                        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                                        return (
                                            <g key={res.name}>
                                                {idx > 0 && (
                                                    <line
                                                        x1={`${((idx - 0.5) / results.length) * 100}%`}
                                                        y1={`${100 - (parseFloat(results[idx - 1].time === "Error" ? "0" : results[idx - 1].time) / maxTime * 100)}%`}
                                                        x2={`${x}%`}
                                                        y2={`${y}%`}
                                                        stroke={colors[idx]}
                                                        strokeWidth="2"
                                                    />
                                                )}
                                                <circle cx={`${x}%`} cy={`${y}%`} r="4" fill={colors[idx]} />
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                            {/* X-axis labels */}
                            <div className="ml-8 mt-2 flex justify-around text-xs text-gray-400">
                                {results.map(res => (
                                    <span key={res.name}>{res.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Nodes Visited Graph */}
                    <div className="bg-gray-900 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-3">Nodes Visited</p>
                        <div className="relative h-40">
                            {/* Y-axis */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                                <span>{Math.max(...results.map(r => r.nodesVisited))}</span>
                                <span>0</span>
                            </div>
                            {/* Graph area */}
                            <div className="ml-8 h-full relative border-l border-b border-gray-700">
                                {/* Grid lines */}
                                <div className="absolute inset-0">
                                    {[0, 25, 50, 75, 100].map(pct => (
                                        <div key={pct} className="absolute w-full border-t border-gray-800" style={{ bottom: `${pct}%` }} />
                                    ))}
                                </div>
                                {/* Data points and lines */}
                                <svg className="absolute inset-0 w-full h-full">
                                    {results.map((res, idx) => {
                                        const maxNodes = Math.max(...results.map(r => r.nodesVisited));
                                        const x = ((idx + 0.5) / results.length) * 100;
                                        const y = 100 - (res.nodesVisited / maxNodes * 100);
                                        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                                        return (
                                            <g key={res.name}>
                                                {idx > 0 && (
                                                    <line
                                                        x1={`${((idx - 0.5) / results.length) * 100}%`}
                                                        y1={`${100 - (results[idx - 1].nodesVisited / maxNodes * 100)}%`}
                                                        x2={`${x}%`}
                                                        y2={`${y}%`}
                                                        stroke={colors[idx]}
                                                        strokeWidth="2"
                                                    />
                                                )}
                                                <circle cx={`${x}%`} cy={`${y}%`} r="4" fill={colors[idx]} />
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                            {/* X-axis labels */}
                            <div className="ml-8 mt-2 flex justify-around text-xs text-gray-400">
                                {results.map(res => (
                                    <span key={res.name}>{res.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
