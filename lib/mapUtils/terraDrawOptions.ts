import { ColorCache } from "@/lib/mapUtils/colorCache";
import { TerradrawControlOptions } from "@watergis/maplibre-gl-terradraw";
import { TerraDrawPolygonMode, TerraDrawSelectMode } from "terra-draw";

export function generateTerraDrawOptions(colorCache:ColorCache) {
    const terraDrawOptions:TerradrawControlOptions =
    {
        modes: [
            "render",
            "polygon",
            "select",
        ],
        modeOptions: {
            select: new TerraDrawSelectMode({
                allowManualDeselection: false,

                flags: {
                    polygon: {

                        feature: {
                            draggable: false,
                            rotateable: false,
                            scaleable: true,
                            coordinates: {
                                midpoints: true,
                                draggable: true,
                                deletable: true,
                            },
                            selfIntersectable: false,
                        }


                    }
                },

            }),
            polygon: new TerraDrawPolygonMode({
                styles: {
                    fillColor: ({ id }) => {
                        return colorCache.getColor(`"${id}"`);
                    },
                    outlineColor: ({ id }) => {
                        return colorCache.getColor(`"${id}"`);
                    },
                },


            }),
        }
    }


    return terraDrawOptions;
}
