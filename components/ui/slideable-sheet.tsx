import React, { useState, useRef, useLayoutEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface SlideableSheetProps {
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    preview: React.ReactNode;
}

const SlideableSheet: React.FC<SlideableSheetProps> = ({
    children,
    isOpen,
    onOpenChange,
    preview
}) => {
    const sheetRef = useRef<HTMLDivElement>(null);
    const previewHeight = 70;
    const [maxHeight, setMaxHeight] = useState(0);
    const [initialized, setInitialized] = useState(false);
    const dragThreshold = 10; // 🔥 Mínimo de px para considerar un "arrastre válido"

    const [{ y }, api] = useSpring(() => ({
        y: 0,
        config: { tension: 100, friction: 30 } // 🔥 Más fricción para que se sienta más firme
    }));

    useLayoutEffect(() => {
        if (sheetRef.current) {
            const height = sheetRef.current.getBoundingClientRect().height;
            setMaxHeight(height);
            setTimeout(() => {
                api.set({ y: height - previewHeight });
                setInitialized(true);
            }, 0);
        }
    }, []);

    const minPosition = maxHeight - previewHeight; // 🔽 Cerrado
    const middlePosition = maxHeight / 2; // 🔽 Estado intermedio
    const openPosition = 0; // 🔼 Abierto

    const openSheet = () => {
        api.start({ y: openPosition });
        onOpenChange(true);
    };

    const closeSheet = () => {
        api.start({ y: minPosition });
        onOpenChange(false);
    };

    const adjustPosition = (currentY: number) => {
        if (currentY < middlePosition / 2) {
            openSheet();
        } else if (currentY > middlePosition + middlePosition / 2) {
            closeSheet();
        } else {
            api.start({ y: middlePosition });
        }
    };

    const bind = useDrag(
        ({ first, last, movement: [, my], offset: [, oy], velocity: [, vy], direction: [, dy] }) => {
            if (first) {
                api.set({ y:y.get() });
            }

            if (Math.abs(my) < dragThreshold) return; // 🔥 Ignorar movimientos muy pequeños

            if (last) {
                if (Math.abs(vy) > 0.8) { // 🔥 Requiere un deslizamiento más fuerte para activarse
                    dy > 0 ? closeSheet() : openSheet();
                } else {
                    adjustPosition(oy);
                }
                return;
            }

            const newY = Math.max(0, Math.min(minPosition, y.get() + my));
            api.start({ y: newY});
        },
        { from: () => [0, y.get()], bounds: { top: 0, bottom: minPosition }, rubberband: true }
    );

    useLayoutEffect(() => {
        if (initialized) {
            isOpen ? openSheet() : closeSheet();
        }
    }, [isOpen, initialized]);

    return (
        <div className="fixed inset-x-0 bottom-0 z-50">
            <animated.div
                ref={sheetRef}
                {...bind()}
                style={{ y }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg touch-none"
            >
                <div className="cursor-grab active:cursor-grabbing">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
                    {preview}
                </div>

                <div className="h-[85vh] overflow-y-auto px-4">{children}</div>
            </animated.div>
        </div>
    );
};

export default SlideableSheet;
