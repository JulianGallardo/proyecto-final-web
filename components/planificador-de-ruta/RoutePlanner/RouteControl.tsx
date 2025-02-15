import { Button } from "@/components/ui/button";
import { RouteChoiceType, VehicleType } from "@/types/PlannerTypes";
import { Config } from "@mynaui/icons-react";
import { Car, Bike, Footprints, Rabbit, Spline, ShieldCheck, Settings } from "lucide-react";

interface RouteControlsProps {
    vehicle: VehicleType;
    setVehicle: (vehicle: VehicleType) => void;
    routeChoice: RouteChoiceType;
    setRouteChoice: (choice: "fastest" | "shortest" | "recommended") => void;
}

const vehicles = [
    { id: "driving-car", label: "Auto", icon: Car },
    { id: "cycling-regular", label: "Bicicleta", icon: Bike },
    { id: "foot-walking", label: "Caminata", icon: Footprints },
];

const routeChoices = [
    { id: "fastest", label: "Más rápido", icon: Rabbit },
    { id: "shortest", label: "Más corto", icon: Spline },
    { id: "recommended", label: "Recomendado", icon: ShieldCheck },
];

export function RouteControls({ vehicle, setVehicle, routeChoice, setRouteChoice }: Readonly<RouteControlsProps>) {
    const buttonBaseClasses = "flex-1 flex items-center justify-center gap-2 min-w-0";
    const buttonActiveClasses = "bg-blue-600 text-white hover:bg-blue-700";
    const buttonInactiveClasses = "bg-white text-black hover:bg-blue-100";

    return (

        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto text-lg font-semibold text-gray-500">
            <div className="flex gap-2  ">
                <Settings className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Configuración</h2>

            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
                {vehicles.map(({ id, label, icon: Icon }) => (
                    <Button
                        key={id}
                        variant={vehicle === id ? "default" : "outline"}
                        onClick={() => setVehicle(id as VehicleType)}
                        className={`${buttonBaseClasses} ${vehicle === id ? buttonActiveClasses : buttonInactiveClasses
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="truncate">{label}</span>
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
                {routeChoices.map(({ id, label, icon: Icon }) => (
                    <Button
                        key={id}
                        variant={routeChoice === id ? "default" : "outline"}
                        onClick={() => setRouteChoice(id as "fastest" | "shortest" | "recommended")}
                        className={`${buttonBaseClasses} ${routeChoice === id ? buttonActiveClasses : buttonInactiveClasses
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="truncate">{label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}