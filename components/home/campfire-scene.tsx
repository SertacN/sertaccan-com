"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
    PXS,
    currentTheme,
    paintDyn,
    paintStatic,
    prefersReducedMotion,
    type Composition,
    type Pt,
    type SceneInfo,
    type TextRect,
    type Theme,
} from "@/components/pixel/painter";

const TICK_MS = 100;
// The prototype starts its clock at 24 so the first frame is not a blank state.
const START_TICK = 24;
export const MOBILE_SCENE_WIDTH = 720;
// Matches the `tall:` variant in globals.css; on such screens the art pixel grows from 4 to 6 CSS px.
const TALL_SCREEN_QUERY = "(min-width: 768px) and (min-height: 1200px)";
const TALL_PIXEL_SIZE = 6;

type StaticLayers = {
    key: string;
    I: SceneInfo;
    sky: HTMLCanvasElement;
    land: HTMLCanvasElement;
    mid: HTMLCanvasElement;
};

function bake(pt: Pt, W: number, H: number) {
    const layer = document.createElement("canvas");
    layer.width = W;
    layer.height = H;
    pt.flush(layer.getContext("2d")!);
    return layer;
}

export default function CampfireScene({
    textRef,
    composition = "B",
}: {
    // The hero text block; trees and twinkling stars stay clear of it.
    textRef: RefObject<HTMLElement | null>;
    composition?: Composition;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = canvas?.parentElement;
        if (!canvas || !host) return;
        const ctx = canvas.getContext("2d")!;
        const frozen = prefersReducedMotion();

        let t = START_TICK;
        let visible = true;
        let layers: StaticLayers | null = null;
        let size = { W: 0, H: 0, px: PXS, mob: false, tr: null as TextRect | null };

        const measure = () => {
            const a = host.getBoundingClientRect();
            const px = window.matchMedia(TALL_SCREEN_QUERY).matches ? TALL_PIXEL_SIZE : PXS;
            const te = textRef.current;
            let tr: TextRect | null = null;
            if (te) {
                const b = te.getBoundingClientRect();
                tr = {
                    x0: Math.floor((b.left - a.left) / px),
                    y0: Math.floor((b.top - a.top) / px),
                    x1: Math.ceil((b.right - a.left) / px),
                    y1: Math.ceil((b.bottom - a.top) / px),
                };
            }
            size = {
                W: Math.ceil(a.width / px),
                H: Math.ceil(a.height / px),
                px,
                mob: a.width < MOBILE_SCENE_WIDTH,
                tr,
            };
        };

        const draw = () => {
            const { W, H, px, mob, tr } = size;
            if (!W || !H) return;
            const th: Theme = currentTheme();
            const key = [W, H, px, th, composition, mob, tr ? [tr.x0, tr.y0, tr.x1, tr.y1].join(",") : ""].join("|");
            if (!layers || layers.key !== key) {
                const st = paintStatic({ W, H, th, comp: composition, mob, tr });
                layers = { key, I: st.I, sky: bake(st.sky, W, H), land: bake(st.land, W, H), mid: bake(st.mid, W, H) };
                canvas.width = W;
                canvas.height = H;
                canvas.style.width = `${W * px}px`;
                canvas.style.height = `${H * px}px`;
            }
            const d = paintDyn(layers.I, t, th, frozen);
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(layers.sky, 0, 0);
            d.S.flush(ctx);
            ctx.drawImage(layers.land, 0, 0);
            d.L.flush(ctx);
            ctx.drawImage(layers.mid, 0, 0);
            d.F.flush(ctx);
        };

        const relayout = () => {
            measure();
            draw();
        };

        relayout();
        document.fonts?.ready.then(relayout);

        const resize = new ResizeObserver(relayout);
        resize.observe(host);
        if (textRef.current) resize.observe(textRef.current);

        // Repaint immediately when the theme class on <html> flips.
        const theme = new MutationObserver(draw);
        theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(host);

        const timer = frozen
            ? undefined
            : setInterval(() => {
                  if (!visible) return;
                  t++;
                  draw();
              }, TICK_MS);

        return () => {
            clearInterval(timer);
            resize.disconnect();
            theme.disconnect();
            io.disconnect();
        };
    }, [composition, textRef]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 block"
            style={{ imageRendering: "pixelated" }}
        />
    );
}
