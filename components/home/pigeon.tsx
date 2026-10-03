"use client";

import { useEffect, useState } from "react";
import { PIGEON_FRAMES, PIGEON_PALETTE } from "@/components/pixel/painter";

const WIDTH = 160;
const HEIGHT = 24;
const TICK_MS = 100;
// After this many ticks the pigeon has landed on the branch.
const LANDED = 70;
// Mid-flight frame shown when motion is reduced.
const STILL_TICK = 30;

// A carrier pigeon flies off with the message, then rests on a branch.
export default function Pigeon() {
    const [k, setK] = useState(0);
    const [still, setStill] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const id = setTimeout(() => setStill(true), 0);
            return () => clearTimeout(id);
        }
        const id = setInterval(
            () =>
                setK((n) => {
                    if (n >= LANDED) clearInterval(id);
                    return n + 1;
                }),
            TICK_MS,
        );
        return () => clearInterval(id);
    }, []);

    const tick = still ? STILL_TICK : k;
    const landed = tick >= LANDED;
    const frame = PIGEON_FRAMES[landed ? 1 : (tick >> 1) % 2];
    const x = Math.min(WIDTH - 20, -12 + tick * 2);
    const y = landed ? 10 : 8 + Math.round(Math.sin(tick / 3) * 2);

    return (
        <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            width="100%"
            height={96}
            preserveAspectRatio="xMinYMid slice"
            shapeRendering="crispEdges"
            aria-hidden="true"
            className="block"
        >
            {landed && <rect x={WIDTH - 22} y={18} width={16} height={2} fill="#5e3618" />}
            {frame.map((row, j) =>
                row.split("").map((c, i) => {
                    const fill = PIGEON_PALETTE[c as keyof typeof PIGEON_PALETTE];
                    return fill ? (
                        <rect key={`${j}-${i}`} x={x + i} y={y + j} width={1} height={1} fill={fill} />
                    ) : null;
                }),
            )}
        </svg>
    );
}
