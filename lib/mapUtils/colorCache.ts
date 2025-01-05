import { HexColorStyling } from "@/types/MapTypes";

export class ColorCache {
    private cache: Map<string, HexColorStyling>

    constructor() {
        this.cache = new Map<string, HexColorStyling>();
    }



    fetchDataFromColorCache(key: string) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        return null;
    }

    saveDataToColorCache(key: string, value: HexColorStyling) {
        this.cache.set(key, value);
    }

    deleteDataInColorCache(key: string) {
        this.cache.delete(key);
    }






}