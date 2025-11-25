import { Activity } from "lucide-react";

export function AlgorithmCard({
  name,
  color,
  distance,
  time,
  active,
}: {
  name: string;
  color: string;
  distance: number | null;
  time: number | null;
  active: boolean;
}) {
  return (
    <div
      className={`p-4 border rounded-lg ${active ? `border-${color}-400 bg-${color}-50` : "border-gray-200 bg-white"} transition-all animate-fade-in`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800 flex items-center">
          <Activity className={`w-4 h-4 mr-2 text-${color}-600`} />
          {name}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <div>{distance ? `${(distance / 1000).toFixed(2)} km` : "—"}</div>
        <div>{time ? `${time.toFixed(2)} ms` : "—"}</div>
      </div>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export function ComparisonChart({ label, values }: { label: string; values: number[] }) {
  const max = Math.max(...values.filter((v) => v > 0));
  return (
    <div className="bg-gray-50 rounded p-3">
      <div className="text-xs font-semibold text-gray-700 mb-2">{label}</div>
      <div className="flex items-end justify-between h-24 gap-1">
        {values.map((v, i) => (
          <ChartBar key={i} height={(v / max) * 100} color={["blue", "green", "purple", "orange", "pink"][i]} />
        ))}
      </div>
    </div>
  );
}

export function ChartBar({ height, color }: { height: number; color: string }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className={`w-full bg-${color}-500 rounded-t transition-all duration-300`} style={{ height: `${height}%` }} />
    </div>
  );
}

export function ProgressBar({ label, progress, color }: { label: string; progress: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color}-500 transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function Loader({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
