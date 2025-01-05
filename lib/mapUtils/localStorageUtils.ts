import { CustomFeature } from "@/types/MapTypes";

function getZoneInfoFromLocalStorage() {
    const zones = JSON.parse(window.localStorage.getItem("zones") || "[]");
    if (zones.length > 0) {
        eraseZoneInfoFromLocalStorage();
        return zones[0];
    }
    else {
        return null;
    }
}

function eraseZoneInfoFromLocalStorage() {
    window.localStorage.removeItem("zones");
}

function writeZoneInfoToLocalStorage(zoneInfo: CustomFeature) {
    window.localStorage.setItem("zones", JSON.stringify([zoneInfo]));
}

function getZoneColorFromLocalStorage() {
    const zones = JSON.parse(window.localStorage.getItem("zones") || "[]");
    if (zones.length > 0) {
        return zones[0].color;
    }
    else {
        return null;
    }
}

export { getZoneInfoFromLocalStorage, eraseZoneInfoFromLocalStorage, writeZoneInfoToLocalStorage, getZoneColorFromLocalStorage };