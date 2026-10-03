"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
    BAYER,
    PXS,
    currentTheme,
    paintDyn,
    paintStatic,
    paintTrans,
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
// Sunrise / sunset: a full night↔day swap takes this long; progress snaps to 1/40 steps.
const TRANSITION_MS = 1300;
const MIN_TRANSITION_MS = 200;
const TRANSITION_STEPS = 40;

type StaticLayers = {
    I: SceneInfo;
    sky: HTMLCanvasElement;
    land: HTMLCanvasElement;
    mid: HTMLCanvasElement;
};
type Transition = { from: number; to: number; start: number; dur: number };

function bake(pt: Pt, W: number, H: number) {
    const layer = document.createElement("canvas");
    layer.width = W;
    layer.height = H;
    pt.flush(layer.getContext("2d")!);
    return layer;
}

// 4x4 Bayer tile with `level` (0-16) opaque pixels, used to dither one theme into the other.
const bayerCache = new Map<number, HTMLCanvasElement>();
function bayerTile(level: number) {
    let tile = bayerCache.get(level);
    if (!tile) {
        tile = document.createElement("canvas");
        tile.width = 4;
        tile.height = 4;
        const t = tile.getContext("2d")!;
        t.fillStyle = "#fff";
        BAYER.forEach((v, i) => v < level && t.fillRect(i % 4, i >> 2, 1, 1));
        bayerCache.set(level, tile);
    }
    return tile;
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
        let size = { W: 0, H: 0, px: PXS, mob: false, tr: null as TextRect | null };
        // Static layers for both themes share one layout key, so a transition can blend them.
        let layers: { base: string; night?: StaticLayers; day?: StaticLayers } = { base: "" };
        let shown: Theme = currentTheme();
        // Transition progress (0 = night, 1 = day) while a sunrise/sunset plays, otherwise null.
        let progress: number | null = null;
        let transition: Transition | null = null;
        let raf = 0;
        // Scratch canvas for dither-masked layers.
        const scratch = document.createElement("canvas");
        const sctx = scratch.getContext("2d")!;

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

        const staticFor = (th: Theme) => {
            const { W, H, px, mob, tr } = size;
            const base = [W, H, px, composition, mob, tr ? [tr.x0, tr.y0, tr.x1, tr.y1].join(",") : ""].join("|");
            if (layers.base !== base) {
                layers = { base };
                canvas.width = W;
                canvas.height = H;
                canvas.style.width = `${W * px}px`;
                canvas.style.height = `${H * px}px`;
                scratch.width = W;
                scratch.height = H;
            }
            let st = layers[th];
            if (!st) {
                const painted = paintStatic({ W, H, th, comp: composition, mob, tr });
                st = {
                    I: painted.I,
                    sky: bake(painted.sky, W, H),
                    land: bake(painted.land, W, H),
                    mid: bake(painted.mid, W, H),
                };
                layers[th] = st;
            }
            return st;
        };

        // Draws a layer through a Bayer mask so only `k` (0-1) of its pixels show.
        const drawDithered = (k: number, paint: (c: CanvasRenderingContext2D) => void) => {
            const level = Math.round(k * 16);
            if (level <= 0) return;
            if (level >= 16) return paint(ctx);
            sctx.globalCompositeOperation = "source-over";
            sctx.clearRect(0, 0, scratch.width, scratch.height);
            paint(sctx);
            sctx.globalCompositeOperation = "destination-in";
            sctx.fillStyle = sctx.createPattern(bayerTile(level), "repeat")!;
            sctx.fillRect(0, 0, scratch.width, scratch.height);
            sctx.globalCompositeOperation = "source-over";
            ctx.drawImage(scratch, 0, 0);
        };

        const drawTransition = (p: number) => {
            const n = staticFor("night");
            const d = staticFor("day");
            const r = paintTrans(n.I, d.I, p, t);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            r.S.flush(ctx);
            drawDithered(r.kl, (c) => r.C.flush(c));
            ctx.drawImage(n.land, 0, 0);
            drawDithered(r.kl, (c) => c.drawImage(d.land, 0, 0));
            drawDithered(r.kn, (c) => r.N.flush(c));
            drawDithered(r.kl, (c) => r.D.flush(c));
            r.RP.flush(ctx);
            ctx.drawImage(n.mid, 0, 0);
            drawDithered(r.kl, (c) => c.drawImage(d.mid, 0, 0));
            r.CN.flush(ctx);
            drawDithered(r.kl, (c) => r.CD.flush(c));
            r.F.flush(ctx);
        };

        const draw = () => {
            if (!size.W || !size.H) return;
            if (progress != null) return drawTransition(progress);
            const st = staticFor(shown);
            const d = paintDyn(st.I, t, shown, frozen);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(st.sky, 0, 0);
            d.S.flush(ctx);
            ctx.drawImage(st.land, 0, 0);
            d.L.flush(ctx);
            ctx.drawImage(st.mid, 0, 0);
            d.F.flush(ctx);
        };

        const stepTransition = (now: number) => {
            if (!transition) return;
            const { from, to, start, dur } = transition;
            const u = Math.min(1, (now - start) / dur);
            if (u >= 1) {
                transition = null;
                progress = null;
                draw();
                return;
            }
            const q = Math.round((from + (to - from) * u) * TRANSITION_STEPS) / TRANSITION_STEPS;
            if (q !== progress) {
                progress = q;
                draw();
            }
            raf = requestAnimationFrame(stepTransition);
        };

        // The rest of the page switches theme instantly; the scene plays a sunrise or sunset.
        // A toggle mid-way reverses from the current point.
        const onThemeChange = () => {
            const next = currentTheme();
            if (next === shown) return;
            shown = next;
            cancelAnimationFrame(raf);
            if (frozen || !visible || !size.W) {
                transition = null;
                progress = null;
                draw();
                return;
            }
            const to = next === "day" ? 1 : 0;
            const from = progress ?? 1 - to;
            transition = {
                from,
                to,
                start: performance.now(),
                dur: Math.max(MIN_TRANSITION_MS, TRANSITION_MS * Math.abs(to - from)),
            };
            raf = requestAnimationFrame(stepTransition);
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

        const theme = new MutationObserver(onThemeChange);
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
            cancelAnimationFrame(raf);
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
