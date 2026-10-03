"use client";

import { useEffect, useRef } from "react";
import {
    EMBERS_HEIGHT,
    PXS,
    currentTheme,
    paintEmbersDyn,
    paintEmbersStatic,
    prefersReducedMotion,
    type EmbersInfo,
    type Theme,
} from "@/components/pixel/painter";

const TICK_MS = 100;
// Frame shown when motion is reduced, matching the design's frozen state.
const STILL_TICK = 12;

// The camp after everyone went to sleep: a dying fire, smoke and a snoring tent.
export default function EmbersStrip() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = canvas?.parentElement;
        if (!canvas || !host) return;
        const ctx = canvas.getContext("2d")!;
        const frozen = prefersReducedMotion();

        let u = frozen ? STILL_TICK : 0;
        let visible = false;
        let base: { key: string; info: EmbersInfo; layer: HTMLCanvasElement } | null = null;

        const draw = () => {
            const W = Math.ceil(host.getBoundingClientRect().width / PXS);
            if (!W) return;
            const th: Theme = currentTheme();
            const key = `${W}|${th}`;
            if (!base || base.key !== key) {
                const info = paintEmbersStatic(W, th);
                const layer = document.createElement("canvas");
                layer.width = W;
                layer.height = EMBERS_HEIGHT;
                info.base.flush(layer.getContext("2d")!);
                base = { key, info, layer };
                canvas.width = W;
                canvas.height = EMBERS_HEIGHT;
                canvas.style.width = `${W * PXS}px`;
                canvas.style.height = `${EMBERS_HEIGHT * PXS}px`;
            }
            ctx.clearRect(0, 0, W, EMBERS_HEIGHT);
            ctx.drawImage(base.layer, 0, 0);
            paintEmbersDyn(base.info, u, th).flush(ctx);
        };

        draw();
        const resize = new ResizeObserver(draw);
        resize.observe(host);
        const theme = new MutationObserver(draw);
        theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(host);
        const timer = frozen
            ? undefined
            : setInterval(() => {
                  if (!visible) return;
                  u++;
                  draw();
              }, TICK_MS);

        return () => {
            clearInterval(timer);
            resize.disconnect();
            theme.disconnect();
            io.disconnect();
        };
    }, []);

    return (
        <div aria-hidden="true" className="relative h-40 overflow-hidden bg-sky-top">
            <canvas
                ref={canvasRef}
                className="absolute bottom-0 left-0 block"
                style={{ imageRendering: "pixelated" }}
            />
        </div>
    );
}
