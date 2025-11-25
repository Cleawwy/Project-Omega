import { MapPin } from "lucide-react";
import { Location } from "@/lib/types";

export function LocationSearch({
  value,
  selected,
  placeholder,
  color,
  onChange,
  onSelect,
  suggestions,
  showDropdown,
  setShowDropdown,
}: {
  value: string;
  selected: Location | null;
  placeholder: string;
  color: string;
  onChange: (value: string) => void;
  onSelect: (location: Location) => void;
  suggestions: Location[];
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}) {
  return (
    <div className="relative border-b border-gray-200 last:border-0">
      <div className="flex items-center px-4 py-3">
        <div className={`w-3 h-3 rounded-full ${color} mr-3`} />
        <input
          type="text"
          placeholder={placeholder}
          value={selected ? selected.name : value}
          onChange={(e) => {
            onChange(e.target.value);
            onSelect(null as any);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="flex-1 outline-none text-sm text-gray-800"
        />
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 max-h-64 overflow-y-auto shadow-lg rounded-b-lg z-50">
          {suggestions.map((loc, i) => (
            <div
              key={i}
              onClick={() => {
                onSelect(loc);
                onChange("");
                setShowDropdown(false);
              }}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 flex items-center"
            >
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {loc.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
