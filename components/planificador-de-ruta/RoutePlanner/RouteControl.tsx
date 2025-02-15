import { Button } from "@/components/ui/button";
import { VehicleType } from "@/types/PlannerTypes";
import { Car, Bike, Footprints } from "lucide-react";

interface RouteControlsProps {
    vehicle: VehicleType;
    setVehicle: (vehicle: VehicleType) => void;
}

const vehicles = [
    { id: "driving-car", label: "Auto", icon: Car },
    { id: "cycling-regular", label: "Bicicleta", icon: Bike },
    { id: "foot-walking", label: "Caminata", icon: Footprints },
];

export function RouteControls({ vehicle, setVehicle }: Readonly<RouteControlsProps>) {
    return (
        <div className="flex items-center justify-center gap-2 mb-4">
            {vehicles.map(({ id, label, icon: Icon }) => (
                <Button
                    key={id}
                    variant={vehicle === id ? "default" : "outline"}
                    onClick={() => setVehicle(id as VehicleType)}
                    className={"flex items-center gap-2 px-4 py-2 hover:bg-blue-200 w-full " +
                        (vehicle === id ? "bg-blue-600 text-white" : "text-black-500")}
                >
                    <Icon className="w-5 h-5" />
                    {label}
                </Button>
            ))}
        </div>
    );
}
