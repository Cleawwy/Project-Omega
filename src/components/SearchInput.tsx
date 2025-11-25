import { MapPin, Navigation, X } from "lucide-react";
import { Location } from "@/lib/types";

interface SearchInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    onClear?: () => void;
    onSelect: (location: Location) => void;
    suggestions: Location[];
    showSuggestions: boolean;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export default function SearchInput({
    placeholder,
    value,
    onChange,
    onFocus,
    onClear,
    onSelect,
    suggestions,
    showSuggestions,
    icon,
    rightElement,
}: SearchInputProps) {
    return (
        <div className="relative group">
            <div className="flex items-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-300 shadow-sm">
                {icon && <div className="mr-3 text-gray-400 group-focus-within:text-green-500 transition-colors">{icon}</div>}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    className="flex-1 bg-transparent outline-none text-gray-800 text-sm placeholder-gray-400"
                />
                {value && onClear && (
                    <button
                        onClick={onClear}
                        className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all mr-2"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                {rightElement}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((loc, i) => (
                        <div
                            key={i}
                            onClick={() => onSelect(loc)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors group/item"
                        >
                            <div className="font-medium text-sm text-gray-800 group-hover/item:text-black">{loc.name}</div>
                            <div className="text-xs text-gray-500 group-hover/item:text-gray-400">
                                {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
