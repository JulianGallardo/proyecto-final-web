import { Button } from "@/components/ui/button";
import { RouteChoiceType, VehicleType } from "@/types/PlannerTypes";
import { Car, Bike, Footprints, Rabbit, Spline, ShieldCheck } from "lucide-react";




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
    return (
        <div className="flex flex-col items-center justify-center gap-2 mb-4 w-full">
            <div className="flex items-center justify-center gap-2 w-full">
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
            <div className="flex items-center  justify-center gap-2 w-full">
                {
                    routeChoices.map(({ id, label, icon:Icon }) => (
                        <Button
                            key={id}
                            variant={vehicle === id ? "default" : "outline"}
                            onClick={() => setRouteChoice(id as "fastest" | "shortest" | "recommended")}
                            className={"flex items-center gap-2 px-4 py-2 hover:bg-blue-200 w-full " +
                                (routeChoice === id ? "bg-blue-600 text-white" : "text-black-500")}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Button>
                    ))
                }
            </div>
        </div>
    );
}
