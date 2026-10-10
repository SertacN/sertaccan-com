"use client";

import { useEffect, useRef, useState, type ReactElement, type RefObject } from "react";
import { prefersReducedMotion } from "@/components/pixel/painter";

const TICK_MS = 100;
const CELL = 4;
// Opacity of a pulse's head and the cells trailing behind it.
const TRAIL = [1, 0.55, 0.3, 0.12];
// Below this gutter width the side traces switch to a thin, compact layout.
const FULL_GUTTER = 96;
// Width of the compact trace, matching the page's side padding on small screens.
const COMPACT_GUTTER = 24;
// Where the branch meets the section, measured from the section's top.
const BRANCH_Y = 120;
const BUS_LOOP = 1400;
const WIRE_HEIGHT = 56;
const WIRE_MIN_WIDTH = 664;
const COLUMN_GAP = 24;

type Point = [number, number];

const snap = (v: number) => Math.round(v / CELL) * CELL;

// Expands an orthogonal/diagonal polyline into the 4px cells it passes through.
function cellsPath(points: Point[]): Point[] {
    const out: Point[] = [];
    for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        const n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)) / CELL;
        const sx = Math.sign(bx - ax) * CELL;
        const sy = Math.sign(by - ay) * CELL;
        for (let k = i === 1 ? 0 : 1; k <= n; k++) out.push([ax + sx * k, ay + sy * k]);
    }
    return out;
}

function Cell({ p, className, opacity }: { p: Point; className: string; opacity?: number }) {
    return <rect x={p[0]} y={p[1]} width={CELL} height={CELL} className={className} opacity={opacity} />;
}

function Trace({ cells, id }: { cells: Point[]; id: string }) {
    return cells.map((p, i) => <Cell key={`${id}${i}`} p={p} className="fill-pixel-line" />);
}

function Pulse({ cells, head, id }: { cells: Point[]; head: number; id: string }) {
    return TRAIL.map((opacity, j) => {
        const p = cells[head - j];
        return p ? <Cell key={`${id}${j}`} p={p} className="fill-primary" opacity={opacity} /> : null;
    });
}

// Shared 100ms clock; it only runs while the element is on screen and motion is allowed.
function useTick(ref: RefObject<Element | null>) {
    const [tick, setTick] = useState(0);
    const [live, setLive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion()) return;
        let timer: ReturnType<typeof setInterval> | undefined;
        const io = new IntersectionObserver(([entry]) => {
            clearInterval(timer);
            if (entry.isIntersecting) timer = setInterval(() => setTick((u) => u + 1), TICK_MS);
        });
        io.observe(el);
        const id = setTimeout(() => setLive(true), 0);
        return () => {
            io.disconnect();
            clearInterval(timer);
            clearTimeout(id);
        };
    }, [ref]);

    return { tick, live };
}

function useWidth(ref: RefObject<Element | null>, measure: (el: Element) => number) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => setWidth(Math.floor(measure(el)));
        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener("resize", update);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, [ref, measure]);
    return width;
}

// Gutter between the section's edge and the viewport edge; the layout is centered, so both sides match.
const measureGutter = (el: Element) => el.getBoundingClientRect().left;
const measureWidth = (el: Element) => el.getBoundingClientRect().width;

/**
 * A circuit trace living in the page gutter next to a section: a vertical bus with
 * data pulses and a branch that ends in a pad, which lights up when a pulse arrives.
 * Place inside a `relative` section; `phase` offsets the timing between sections.
 */
export function SideCircuit({ side, phase }: { side: "left" | "right"; phase: number }) {
    const anchorRef = useRef<HTMLSpanElement>(null);
    const { tick, live } = useTick(anchorRef);
    const gutter = useWidth(anchorRef, measureGutter);

    let svg: ReactElement | null = null;
    if (gutter >= COMPACT_GUTTER) {
        const compact = gutter < FULL_GUTTER;
        const G = compact ? COMPACT_GUTTER : gutter;
        const Y = BRANCH_Y;
        const bx = compact ? CELL : snap(G * 0.35);
        const ex = compact ? 12 : G - 28;
        const branch = compact
            ? cellsPath([
                  [bx, Y - 8],
                  [bx + 8, Y],
              ])
            : cellsPath([
                  [bx, Y - 24],
                  [bx + 24, Y],
                  [ex, Y],
              ]);
        const cycle = branch.length + 34;
        const head = live ? (tick + phase * 11) % cycle : -99;
        const lit = head >= branch.length - 1 && head < branch.length + 8;

        svg = (
            <svg
                aria-hidden="true"
                width={G}
                height="100%"
                shapeRendering="crispEdges"
                className="pointer-events-none absolute top-0 h-full"
                // Pinned to the viewport edge, so the compact trace hugs the screen border.
                style={side === "left" ? { left: -gutter } : { right: -gutter, transform: "scaleX(-1)" }}
            >
                <rect x={bx} y={0} width={CELL} height="100%" className="fill-pixel-line" />
                <Trace cells={branch} id="b" />
                {[0, 1].map((i) => (
                    <rect
                        key={`j${i}`}
                        x={bx - CELL}
                        y={snap(Y + 200 + i * 260)}
                        width={12}
                        height={CELL}
                        className="fill-pixel-line"
                    />
                ))}
                <rect x={ex} y={Y - CELL} width={12} height={12} className="fill-pixel-line" />
                <rect
                    x={ex + CELL}
                    y={Y}
                    width={CELL}
                    height={CELL}
                    className={lit ? "fill-primary" : "fill-background"}
                />
                {live &&
                    [0, 700].map((offset) => {
                        const y = snap((tick * 8 + phase * 173 + offset) % BUS_LOOP);
                        return TRAIL.map((opacity, j) => (
                            <Cell
                                key={`v${offset}${j}`}
                                p={[bx, y - j * CELL]}
                                className="fill-primary"
                                opacity={opacity}
                            />
                        ));
                    })}
                {live && <Pulse cells={branch} head={head} id="bp" />}
            </svg>
        );
    }

    return (
        <span ref={anchorRef} className="pointer-events-none absolute inset-0">
            {svg}
        </span>
    );
}

/**
 * Two wires leaving the bottom of a two-column row, merging at a junction and
 * feeding one wire down into the content below. Hidden when the row stacks.
 */
export function MergeWire() {
    const ref = useRef<HTMLDivElement>(null);
    const { tick, live } = useTick(ref);
    const cw = useWidth(ref, measureWidth);

    let svg: ReactElement | null = null;
    if (cw >= WIRE_MIN_WIDTH) {
        const colW = (cw - COLUMN_GAP) / 2;
        const c1 = snap(colW / 2 - 2);
        const c2 = snap(colW + COLUMN_GAP + colW / 2 - 2);
        const jx = snap(cw / 2 - 2);
        const jy = 24;
        const A = cellsPath([
            [c1, 0],
            [c1, jy],
            [jx - 8, jy],
        ]);
        const B = cellsPath([
            [c2, 0],
            [c2, jy],
            [jx + 8, jy],
        ]);
        const T = cellsPath([
            [jx, jy + 8],
            [jx, WIRE_HEIGHT - 4],
        ]);
        const L = Math.max(A.length, B.length);
        const cycle = L + T.length + 24;
        const t = live ? tick % cycle : -99;
        const hit = t >= L - 1 && t < L + 4;

        svg = (
            <svg aria-hidden="true" width={cw} height={WIRE_HEIGHT} shapeRendering="crispEdges" className="block">
                <Trace cells={A} id="a" />
                <Trace cells={B} id="b" />
                <Trace cells={T} id="t" />
                <rect x={jx - CELL} y={jy - CELL} width={12} height={12} className="fill-pixel-line" />
                <rect x={jx} y={jy} width={CELL} height={CELL} className={hit ? "fill-primary" : "fill-background"} />
                {live && (
                    <>
                        <Pulse cells={A} head={t - (L - A.length)} id="pa" />
                        <Pulse cells={B} head={t - (L - B.length)} id="pb" />
                        <Pulse cells={T} head={t - L - 2} id="pt" />
                    </>
                )}
            </svg>
        );
    }

    // Negative margins let the wire span the flex gaps so it touches both rows.
    return (
        <div ref={ref} className="pointer-events-none -my-8 hidden h-14 min-[712px]:block">
            {svg}
        </div>
    );
}
