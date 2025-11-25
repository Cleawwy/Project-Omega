import { Car, Utensils, ShoppingBag, Package, Bike, MoreHorizontal } from "lucide-react";

interface HomeScreenProps {
    onBookRide: () => void;
}

export default function HomeScreen({ onBookRide }: HomeScreenProps) {
    const services = [
        { icon: <Car className="w-8 h-8 text-green-600" />, label: "Car", action: onBookRide },
        { icon: <Utensils className="w-8 h-8 text-orange-500" />, label: "Food", action: () => { } },
        { icon: <ShoppingBag className="w-8 h-8 text-blue-500" />, label: "Mart", action: () => { } },
        { icon: <Package className="w-8 h-8 text-purple-500" />, label: "Express", action: () => { } },
        { icon: <Bike className="w-8 h-8 text-green-500" />, label: "Bike", action: () => { } },
        { icon: <MoreHorizontal className="w-8 h-8 text-gray-500" />, label: "More", action: () => { } },
    ];

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="bg-green-500 p-6 pt-12 rounded-b-[30px] shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white" />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                        <span className="font-bold text-green-600 text-sm">Gold Member</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                        <span className="font-bold text-green-700 text-xl">RM 24.50</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">GrabPay Wallet</p>
                        <p className="text-xs text-green-600 font-bold">Top Up</p>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="p-6 grid grid-cols-4 gap-y-8 gap-x-4 mt-2">
                {services.map((service, index) => (
                    <button
                        key={index}
                        onClick={service.action}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-active:scale-95 transition-all border border-gray-100">
                            {service.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{service.label}</span>
                    </button>
                ))}
            </div>

            {/* Promo Banner */}
            <div className="px-6 mt-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
                    <h3 className="font-bold text-lg mb-1">50% OFF Rides</h3>
                    <p className="text-xs opacity-90 mb-3">Use code: OMEGA50 for your next ride to KLCC.</p>
                    <button className="bg-white text-purple-600 text-xs font-bold px-4 py-2 rounded-lg">
                        Claim Now
                    </button>
                </div>
            </div>
        </div>
    );
}
