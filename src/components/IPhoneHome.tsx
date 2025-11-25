import { useState, useEffect } from "react";

interface IPhoneHomeProps {
    onOpenApp: () => void;
}

export default function IPhoneHome({ onOpenApp }: IPhoneHomeProps) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const [isExiting, setIsExiting] = useState(false);

    const handleOpen = () => {
        setIsExiting(true);
        setTimeout(onOpenApp, 500); 
    };

    return (
        <div className={`w-full h-full bg-[url('/wallpaper.jpg')] bg-cover bg-center flex flex-col items-center text-white relative overflow-hidden ${isExiting ? 'animate-fade-out scale-110 opacity-0 transition-all duration-500' : 'animate-fade-in'}`}>
            {/* Status Bar Placeholder */}
            <div className="w-full h-12" />

            {/* Time */}
            <div className="mt-8 flex flex-col items-center">
                <h1 className="text-7xl font-thin tracking-tight drop-shadow-lg">{time}</h1>
                <p className="text-lg font-medium opacity-90 drop-shadow-md mt-1">Wednesday, November 19</p>
            </div>

            {/* App Grid */}
            <div className="mt-auto mb-24 grid grid-cols-4 gap-6 px-6 w-full">
                {/* Grab App Icon */}
                <button
                    onClick={handleOpen}
                    className="flex flex-col items-center gap-2 group transition-transform active:scale-90"
                >
                    <div className="w-16 h-16 bg-green-500 rounded-[18px] flex items-center justify-center shadow-2xl group-hover:shadow-green-500/50 transition-all relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        <span className="font-bold text-2xl italic tracking-tighter">Grab</span>
                    </div>
                    <span className="text-xs font-medium drop-shadow-md">Grab</span>
                </button>

                {/* Placeholder Icons */}
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 opacity-80 grayscale hover:grayscale-0 transition-all">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[18px] shadow-lg" />
                        <div className="w-12 h-3 bg-white/20 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Dock */}
            <div className="w-[90%] h-24 bg-white/20 backdrop-blur-xl rounded-[35px] mb-6 flex items-center justify-around px-4 shadow-2xl border border-white/10">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-14 h-14 bg-white/10 rounded-[16px]" />
                ))}
            </div>
        </div>
    );
}
