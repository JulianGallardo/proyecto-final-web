import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ZoneDtoWithSubZones } from '@/types/ZoneTypes';
import { X } from "lucide-react";

interface ZoneSelectsProps {
    zones: ZoneDtoWithSubZones[];
    onZoneChange: (zone: string) => void;
    onSubZoneChange: (subZone: string) => void;
    className?: string;
}

const ZoneSelects = ({ onZoneChange, onSubZoneChange, className = '', zones }: ZoneSelectsProps) => {
    const [selectedZone, setSelectedZone] = useState<string>('');
    const [selectedSubZone, setSelectedSubZone] = useState<string>('');

    useEffect(() => {
        setSelectedSubZone('');
    }, [selectedZone]);

    const handleZoneChange = (value: string) => {
        if (value === 'clear') {
            setSelectedZone('');
            onZoneChange('');
            setSelectedSubZone('');
            onSubZoneChange('');
            return;
        }
        setSelectedZone(value);
        onZoneChange(value);
    };

    const handleSubZoneChange = (value: string) => {
        if (value === 'clear') {
            setSelectedSubZone('');
            onSubZoneChange('');
            return;
        }
        setSelectedSubZone(value);
        onSubZoneChange(value);
    };

    return (
        <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
            <div className="relative w-full">
                <Select value={selectedZone} onValueChange={handleZoneChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedZone && (
                            <SelectItem value="clear" className="text-red-500">
                                <span className="flex items-center gap-2">
                                    <X size={16} />
                                    Deseleccionar
                                </span>
                            </SelectItem>
                        )}
                        {zones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.zoneName}>
                                {zone.zoneName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="relative w-full">
                <Select
                    value={selectedSubZone}
                    onValueChange={handleSubZoneChange}
                    disabled={!selectedZone}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar subzona" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedSubZone && (
                            <SelectItem value="clear" className="text-red-500">
                                <span className="flex items-center gap-2">
                                    <X size={16} />
                                    Deseleccionar
                                </span>
                            </SelectItem>
                        )}
                        {selectedZone && zones.find((zone) => zone.zoneName === selectedZone)?.SubZonas.map((subZone) => (
                            <SelectItem key={subZone.id} value={subZone.zoneName}>
                                {subZone.zoneName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ZoneSelects;