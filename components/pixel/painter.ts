// Pixel art painter for the "Pixel Camp" theme, ported from the Claude Design prototype.
// Shapes are recorded per (group, color) and flushed to a canvas in the same order the
// prototype rendered its SVG paths, so layering matches the design exactly.

export type Theme = "night" | "day";
export type Composition = "A" | "B";
export const PXS = 4;

export function hh(a: number, b: number) {
    let x = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
    x = Math.imul(x ^ (x >>> 13), 1274126177);
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

export function rng(seed: number) {
    let s = seed;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const DITHER_PREFIX = "dz:";
const patternCache = new WeakMap<CanvasRenderingContext2D, Map<string, CanvasPattern>>();

// 2x2 checkerboard between two colors, anchored at the canvas origin like the SVG pattern was.
function ditherPattern(ctx: CanvasRenderingContext2D, key: string) {
    let cache = patternCache.get(ctx);
    if (!cache) {
        cache = new Map();
        patternCache.set(ctx, cache);
    }
    let pattern = cache.get(key);
    if (!pattern) {
        const [a, b] = key.slice(DITHER_PREFIX.length).split(":");
        const tile = document.createElement("canvas");
        tile.width = 2;
        tile.height = 2;
        const t = tile.getContext("2d")!;
        t.fillStyle = a;
        t.fillRect(0, 0, 2, 2);
        t.fillStyle = b;
        t.fillRect(0, 0, 1, 1);
        t.fillRect(1, 1, 1, 1);
        pattern = ctx.createPattern(tile, "repeat")!;
        cache.set(key, pattern);
    }
    return pattern;
}

export class Pt {
    private g = 0;
    private m = new Map<string, number[]>();

    grp() {
        this.g++;
    }

    r(x: number, y: number, w: number, h: number, c: string | null | undefined) {
        if (!c || w <= 0 || h <= 0) return;
        const k = this.g + "|" + c;
        let a = this.m.get(k);
        if (!a) {
            a = [];
            this.m.set(k, a);
        }
        a.push(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }

    dz(a: string, b: string) {
        return DITHER_PREFIX + a + ":" + b;
    }

    spr(rows: string[], pal: Record<string, string>, x0: number, y0: number) {
        for (let y = 0; y < rows.length; y++) {
            const row = rows[y];
            let s = 0;
            for (let x = 1; x <= row.length; x++) {
                if (x === row.length || row[x] !== row[s]) {
                    const c = pal[row[s]];
                    if (c) this.r(x0 + s, y0 + y, x - s, 1, c);
                    s = x;
                }
            }
        }
    }

    circ(cx: number, cy: number, r: number, c: string) {
        for (let y = -r; y <= r; y++) {
            const w = Math.round(Math.sqrt(r * r - y * y) - 0.2);
            this.r(cx - w, cy + y, 2 * w + 1, 1, c);
        }
    }

    ell(
        cx: number,
        cy: number,
        rx: number,
        ry: number,
        c: string,
        f?: ((y: number) => number) | null,
        xm?: ((y: number) => number) | null,
    ) {
        for (let y = -ry; y <= ry; y++) {
            let w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))));
            if (f) w += f(y);
            if (w > 0) {
                const x0 = cx - w;
                const x1 = xm ? Math.min(cx + w + 1, xm(cy + y)) : cx + w + 1;
                this.r(x0, cy + y, x1 - x0, 1, c);
            }
        }
    }

    line(x0: number, y0: number, x1: number, y1: number, c: string) {
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        const dx = Math.abs(x1 - x0);
        const sx = x0 < x1 ? 1 : -1;
        const dy = -Math.abs(y1 - y0);
        const sy = y0 < y1 ? 1 : -1;
        let e = dx + dy;
        for (let i = 0; i < 600; i++) {
            this.r(x0, y0, 1, 1, c);
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * e;
            if (e2 >= dy) {
                e += dy;
                x0 += sx;
            }
            if (e2 <= dx) {
                e += dx;
                y0 += sy;
            }
        }
    }

    flush(ctx: CanvasRenderingContext2D) {
        for (const [key, rects] of this.m) {
            const c = key.slice(key.indexOf("|") + 1);
            ctx.fillStyle = c.startsWith(DITHER_PREFIX) ? ditherPattern(ctx, c) : c;
            for (let i = 0; i < rects.length; i += 4) ctx.fillRect(rects[i], rects[i + 1], rects[i + 2], rects[i + 3]);
        }
    }
}

type TentPalette = Record<"f" | "s" | "sd" | "h" | "fl" | "i" | "l" | "rope" | "wd" | "sh", string>;
type ThemePalette = {
    sky: string[];
    hill: string;
    far: string;
    ground: string;
    gDark: string;
    gLite: string;
    gDot: string;
    pine: string;
    pineHi: string;
    pineSh: string;
    fireHi: string;
    trunk: string;
    dirt: string;
    page: string;
    tent: TentPalette;
    water: string;
    ripple: string;
    refl: string;
    refl2: string;
    stone: string;
    stoneHi: string;
    wood: string;
    woodD: string;
    ring: string;
};

export const TH: Record<Theme, ThemePalette> = {
    night: {
        sky: ["#0b1026", "#10173a", "#172050", "#222e5c"],
        hill: "#1a2452",
        far: "#111a3a",
        ground: "#15241b",
        gDark: "#0f1b14",
        gLite: "#1f3426",
        gDot: "#2a4432",
        pine: "#0e1f1d",
        pineHi: "#1a3430",
        pineSh: "#0a1614",
        fireHi: "#3a2e22",
        trunk: "#1c1410",
        dirt: "#24170e",
        page: "#0a0a0a",
        tent: {
            f: "#a24c2c",
            s: "#6a2c18",
            sd: "#58230f",
            h: "#d97a4c",
            fl: "#c0603a",
            i: "#1c0b05",
            l: "#9a4a1e",
            rope: "#7a6a50",
            wd: "#4a2e18",
            sh: "#0b140e",
        },
        water: "#0c1532",
        ripple: "#1d2a5a",
        refl: "#d6d0a6",
        refl2: "#7c7a68",
        stone: "#3e3e48",
        stoneHi: "#8e6650",
        wood: "#5e3618",
        woodD: "#3e220e",
        ring: "#a8784a",
    },
    day: {
        sky: ["#56b4ec", "#6ec3f2", "#8dd0f5", "#b6e2f7"],
        hill: "#9cc8e2",
        far: "#5f9c78",
        ground: "#5fa24e",
        gDark: "#4b8a3d",
        gLite: "#76b960",
        gDot: "#f0e49a",
        pine: "#2e6b40",
        pineHi: "#41875a",
        pineSh: "#1f4d2d",
        fireHi: "#41875a",
        trunk: "#4a2e1a",
        dirt: "#6a4628",
        page: "#f8f8f8",
        tent: {
            f: "#c8643c",
            s: "#943f24",
            sd: "#7e341c",
            h: "#eb9a6c",
            fl: "#d6744a",
            i: "#3a170b",
            l: "#3a170b",
            rope: "#d9c9a0",
            wd: "#5a3a20",
            sh: "#4b8a3d",
        },
        water: "#3d93cf",
        ripple: "#86c6ec",
        refl: "#ffffff",
        refl2: "#b8e0f6",
        stone: "#6c6c76",
        stoneHi: "#a6a6b0",
        wood: "#7a4a28",
        woodD: "#553018",
        ring: "#c8925a",
    },
};

// Coder sitting by the fire (three-quarter view), plus frame overrides for typing and reaching.
const CH = [
    ".......HHHHH............",
    ".....HHHHHHhH...........",
    "....HHHHHHhhHH..........",
    "...HHHHHHHHHHHH.........",
    "...HHHHHHHSSSSH.........",
    "...HHHHHSSSSSSS.........",
    "...HHHsSSSESSES.........",
    "...HHHsSSSSSSSSS........",
    "....HHHSSSSSSSG.........",
    "....HHHSSSSSssG.........",
    ".....HHsSSSSSG..........",
    "........sss.............",
    "......TTTTTTT....Nnl....",
    ".....TTTTTTTTT...Nnl....",
    "....tTTTTTTTTTO..Nnl....",
    "....tTTTTTTTTOO..Nnl....",
    "....tTTTTTTTTOOO.Nnl....",
    "....tttTTTTTTTOOSNnl....",
    ".....ttTTTTTTTTOSSnl....",
    "......PPPPPPPPLLLLLLll..",
    "......PPPPPPPPPPPPpp....",
    "......pPPPPPPPPPPPPp....",
    ".WWWWWWWWWWWW....PPp....",
    "WWrWWWWWWWWWWW...PPp....",
    "WrrWWWWWWWWWWW...PPp....",
    "WWrWwwwwwwwwww...PPp....",
    ".wwwwwwwwwwww...BBBBB...",
    ".................BBBBB..",
];
const FR: Record<"A" | "B" | "R", Record<number, string>> = {
    A: {},
    B: { 16: "....tTTTTTTTTOOOSNnl....", 17: "....tttTTTTTTTOO.Nnl....", 18: ".....ttTTTTTTTTOSnnl...." },
    R: {
        13: ".....TTTTTTTTTOOOOOOOSS.",
        14: "....tTTTTTTTTTO..Nnl....",
        15: "....tTTTTTTTTT...Nnl....",
        16: "....tTTTTTTTTT...Nnl....",
        17: "....tttTTTTTTT...Nnl....",
        18: ".....ttTTTTTTTT..nnl....",
    },
};

export const CP: Record<Theme, Record<string, string>> = {
    night: {
        H: "#2a1a10",
        h: "#4a3020",
        S: "#cf9a76",
        s: "#9c6a4c",
        E: "#120c08",
        G: "#8fd8a4",
        T: "#30497a",
        t: "#1f3056",
        O: "#8a5a5c",
        P: "#363848",
        p: "#252634",
        B: "#4e3220",
        L: "#a9adba",
        l: "#6c707e",
        N: "#00ff88",
        n: "#00b862",
        W: "#5e3618",
        w: "#3e220e",
        r: "#a8784a",
    },
    day: {
        H: "#3b2417",
        h: "#5e3a26",
        S: "#f0bb92",
        s: "#c98a62",
        E: "#1a1a1a",
        G: "#d2efc4",
        T: "#3a5a94",
        t: "#283f6c",
        O: "#3a5a94",
        P: "#44475a",
        p: "#30323f",
        B: "#5a3a24",
        L: "#c9ccd6",
        l: "#8a8e9c",
        N: "#00ff88",
        n: "#00c46a",
        W: "#7a4a28",
        w: "#553018",
        r: "#c8925a",
    },
};

const OWL = [".o...o.", "ooooooo", "oYYoYYo", "oYKoKYo", "ooobooo", ".olllo.", ".olllo.", "..f.f.."];
const OWLP = { o: "#6e5238", l: "#a4865c", Y: "#f2d64a", K: "#120c08", b: "#d08a3a", f: "#d08a3a", d: "#3e2c1c" };

export const PORTRAIT = [
    ".....HHHHHH.....",
    "...HHHHHHHHhH...",
    "..HHHHHHHHhhHH..",
    "..HHHHHHHHHHHHH.",
    "..HHHHHHHSSSSHH.",
    "..HHHHHSSSSSSSH.",
    "..HHHsSSSSSSSSS.",
    "..HHHsSSESSSSES.",
    "..HHHsSSESSSSES.",
    "..HHHsSSSSSSSSSS",
    "...HHSSSSSSSSSG.",
    "...HHSSSSsssSG..",
    "....HsSSSSSSSG..",
    "......sssssss...",
    "....TTTTTsTTTT..",
    "..TTTTTTTTTTTTTT",
].map((r) => r.padEnd(16, "."));

export const PIGEON_FRAMES = [
    [
        "....ww......",
        "...wwww.....",
        "..wwwww..gg.",
        ".gggggggggKb",
        "ggggggggggg.",
        "..LLLgggg...",
        "..LRL.......",
        "..LLL.......",
    ],
    [
        "............",
        "............",
        ".........gg.",
        ".gggggggggKb",
        "gggwwwwgggg.",
        "..LLwwwwg...",
        "..LRL.ww....",
        "..LLL.......",
    ],
];
export const PIGEON_PALETTE = { g: "#c9ccd6", w: "#8a8e9c", K: "#120c08", b: "#f2a03a", L: "#f4f1e6", R: "#c74707" };

type PineColors = { b: string; tr: string; hi?: string; sh?: string };

function pine(p: Pt, x: number, base: number, ht: number, c: PineColors, side: number, solid?: boolean) {
    if (!solid) p.grp();
    const th = Math.max(2, Math.round(ht * 0.14));
    p.r(x - 1, base - th, 2, th, c.tr);
    const ch = ht - th;
    const tiers = ht < 14 ? 2 : ht < 32 ? 3 : 4;
    const tl = ch / tiers;
    for (let r = 0; r < ch; r++) {
        const k = Math.min(tiers - 1, Math.floor(r / tl));
        const u = (r - k * tl) / tl;
        const mx = ((k + 1) / tiers) * ht * 0.3 + 1;
        const mn = k ? mx * 0.5 : 0;
        const w = Math.round(mn + (mx - mn) * u);
        const y = base - ht + r;
        p.r(x - w, y, 2 * w + 1, 1, c.b);
        if (solid) continue;
        if (w >= 2) {
            if (side > 0) p.r(x + w - 1, y, 1, 1, c.hi);
            else p.r(x - w, y, 1, 1, c.hi);
        }
        if (u > 0.82 && w >= 3) p.r(x - w + 1, y, 2 * w - 1, 1, c.sh);
    }
}

export type TextRect = { x0: number; y0: number; x1: number; y1: number };

export type SceneInfo = {
    W: number;
    H: number;
    gy: number;
    campY: number;
    cx: number;
    lake: number | null;
    lakeRow?: (y: number) => number;
    moon: { x: number; y: number; r: number };
    mob: boolean;
    chX: number;
    chY: number;
    stars: { x: number; y: number; p: number; ph: number }[];
    cross: { x: number; y: number; p: number; ph: number }[];
    clouds: { x0: number; y: number; w: number }[];
    ripples: { x: number; y: number; w: number }[];
    owl: { x: number; y: number } | null;
    ss: { x: number; y: number };
    tent?: { fx: number; by: number; hw: number; d: number };
    tufts: { x: number; y: number }[];
};

export function paintStatic(cf: {
    W: number;
    H: number;
    th: Theme;
    comp: Composition;
    mob: boolean;
    tr: TextRect | null;
}) {
    const { W, H, th, comp, mob, tr } = cf;
    const T = TH[th];
    const night = th === "night";
    const R = rng((comp === "B" ? 77 : 31) + (mob ? 5 : 0));
    const sky = new Pt();
    const land = new Pt();
    const mid = new Pt();
    const gy = Math.min(H - 34, Math.max(Math.round(H * (mob ? 0.68 : 0.66)), tr ? tr.y1 + 4 : 0));
    const campY = Math.min(H - 9, Math.max(gy + Math.round((H - gy) * 0.45), tr ? tr.y1 + 31 : 0));
    const cx = Math.round(W * (mob ? (comp === "B" ? 0.44 : 0.52) : comp === "B" ? 0.6 : 0.5));
    const lake = comp === "B" ? Math.round(W * (mob ? 0.84 : 0.79)) : null;
    const moon = {
        x: Math.round(comp === "B" ? (mob ? W - 13 : W * 0.89) : mob ? W - 13 : W * 0.8),
        y: mob ? 24 : Math.round(gy * 0.24),
        r: mob ? 6 : 10,
    };
    const inText = (x: number, y: number, m: number) =>
        !!tr && x >= tr.x0 - m && x <= tr.x1 + m && y >= tr.y0 - m && y <= tr.y1 + m;
    const I: SceneInfo = {
        W,
        H,
        gy,
        campY,
        cx,
        lake,
        moon,
        mob,
        chX: cx - 31,
        chY: campY - 27,
        stars: [],
        cross: [],
        clouds: [],
        ripples: [],
        owl: null,
        ss: { x: Math.round(W * (comp === "B" ? 0.48 : 0.1)), y: 4 },
        tufts: [],
    };

    // Sky bands with dithered seams.
    const b = [0, Math.round(gy * 0.36), Math.round(gy * 0.6), Math.round(gy * 0.8), gy];
    sky.grp();
    for (let i = 0; i < 4; i++) sky.r(0, b[i], W, b[i + 1] - b[i], T.sky[i]);
    for (let i = 1; i < 4; i++) sky.r(0, b[i] - 3, W, 3, sky.dz(T.sky[i - 1], T.sky[i]));
    const bandAt = (y: number) => T.sky[y < b[1] ? 0 : y < b[2] ? 1 : y < b[3] ? 2 : 3];

    if (night) {
        const n = Math.round((W * gy) / 85);
        sky.grp();
        for (let i = 0; i < n; i++) {
            const x = Math.floor(R() * W);
            const y = 2 + Math.floor(Math.pow(R(), 1.5) * (gy - 14));
            if (Math.hypot(x - moon.x, y - moon.y) < moon.r + 6) continue;
            if (!inText(x, y, 6) && R() < 0.35) {
                I.stars.push({ x, y, p: 20 + Math.floor(R() * 30), ph: Math.floor(R() * 50) });
                continue;
            }
            sky.r(x, y, 1, 1, R() < 0.3 ? "#9aa4d4" : "#4e5890");
        }
        for (let i = 0, tries = 0; i < (mob ? 4 : 8) && tries < 200; tries++) {
            const x = 4 + Math.floor(R() * (W - 8));
            const y = 6 + Math.floor(R() * (gy * 0.6));
            if (inText(x, y, 8) || Math.hypot(x - moon.x, y - moon.y) < moon.r + 10) continue;
            I.cross.push({ x, y, p: 24 + Math.floor(R() * 24), ph: Math.floor(R() * 40) });
            i++;
        }
        sky.grp();
        sky.circ(moon.x, moon.y, moon.r + 4, sky.dz(bandAt(moon.y), "#26306a"));
        sky.circ(moon.x, moon.y, moon.r + 1, "#3a4478");
        sky.grp();
        sky.circ(moon.x, moon.y, moon.r, "#efe8c8");
        const q = moon.r / 10;
        sky.r(
            moon.x - Math.round(5 * q),
            moon.y - Math.round(3 * q),
            Math.max(2, Math.round(3 * q)),
            Math.max(1, Math.round(2 * q)),
            "#d4caa0",
        );
        sky.r(moon.x + Math.round(2 * q), moon.y + Math.round(1 * q), 2, 2, "#d4caa0");
        sky.r(moon.x - Math.round(2 * q), moon.y + Math.round(5 * q), Math.max(2, Math.round(4 * q)), 1, "#d4caa0");
        sky.r(moon.x + Math.round(4 * q), moon.y - Math.round(6 * q), 2, 1, "#d4caa0");
        for (let y = -moon.r; y <= moon.r; y++) {
            const w = Math.round(Math.sqrt(moon.r * moon.r - y * y) - 0.2);
            if (y > -moon.r * 0.4) sky.r(moon.x + w, moon.y + y, 1, 1, "#c9bf94");
        }
    } else {
        sky.grp();
        sky.circ(moon.x, moon.y, moon.r + 4, sky.dz(bandAt(moon.y), "#d6f0fb"));
        sky.grp();
        sky.circ(moon.x, moon.y, moon.r, "#ffd84a");
        sky.circ(moon.x - 1, moon.y - 1, moon.r - 3, "#ffe88a");
        sky.r(moon.x - 3, moon.y - 4, 2, 1, "#fff6c8");
        const nc = mob ? 3 : 6;
        for (let i = 0; i < nc; i++)
            I.clouds.push({
                x0: Math.floor(R() * (W + 50)),
                y: 8 + Math.floor(R() * (gy * 0.42)),
                w: 14 + Math.floor(R() * 20),
            });
    }

    // Far hills.
    land.grp();
    const ph = comp === "B" ? 2 : 0.5;
    for (let x = 0; x < W; x++) {
        const top = gy - Math.round(8 + 5 * Math.sin(x / 27 + ph) + 3 * Math.sin(x / 11 + 1.3));
        land.r(x, top, 1, gy - top, T.hill);
    }
    // Far treeline.
    land.grp();
    for (let x = 0; x < W + 4; x += 2 + Math.floor(R() * 3)) {
        let ht = 4 + Math.floor(R() * 8);
        if (tr && x + ht * 0.3 > tr.x0 && x - ht * 0.3 < tr.x1) ht = Math.min(ht, gy + 1 - (tr.y1 + 3));
        if (ht >= 3) pine(land, x, gy + 1, ht, { b: T.far, tr: T.far }, 1, true);
    }
    // Ground.
    land.grp();
    land.r(0, gy, W, H - gy, T.ground);
    land.r(0, gy + 1, W, 2, land.dz(T.gDark, T.ground));
    land.r(0, gy, W, 1, T.gDark);
    for (let i = 0, n = Math.round((W * (H - gy)) / 16); i < n; i++) {
        const x = Math.floor(R() * W);
        const y = gy + 3 + Math.floor(R() * (H - gy - 5));
        const deep = (y - gy) / (H - gy);
        land.r(x, y, 1, deep > 0.5 ? 2 : 1, R() < 0.55 ? T.gLite : T.gDark);
        if (deep > 0.4 && R() < 0.25) land.r(x + 1, y + 1, 1, 1, T.gLite);
    }
    if (!night)
        for (let i = 0; i < W / 10; i++) {
            const x = Math.floor(R() * W);
            const y = gy + 6 + Math.floor(R() * (H - gy - 9));
            land.r(x, y, 1, 1, R() < 0.5 ? T.gDot : "#ffffff");
        }
    // Lake.
    if (lake != null) {
        land.grp();
        for (let y = gy + 1; y < H - 3; y++) {
            const xl = lake - Math.round((y - gy) * 0.9) - (hh(y >> 1, 5) > 0.6 ? 1 : 0);
            land.r(xl, y, W - xl, 1, T.water);
            land.r(xl - 1, y, 1, 1, night ? "#2a3a2e" : "#c9b98a");
            if (y > gy + 2 && hh(y, 17) > 0.55)
                I.ripples.push({
                    x: xl + 3 + Math.floor(hh(y, 23) * Math.max(1, W - xl - 8)),
                    y,
                    w: 2 + Math.floor(hh(y, 29) * 5),
                });
        }
        I.lakeRow = (y) => lake - Math.round((y - gy) * 0.9);
    }
    // Mid pines.
    const trees: { x: number; base: number; ht: number }[] = [];
    let x = -6;
    while (x < W + 6) {
        x += (mob ? 4 : 6) + Math.floor(R() * (mob ? 5 : 7));
        const dc = Math.abs(x - cx);
        let ht = Math.round(20 + R() * 22 + Math.min(1, dc / (W * 0.5)) * 16);
        const base = gy + 2 + Math.floor(R() * 3);
        if (x > cx - 44 && x < cx + 58) ht = Math.round(ht * 0.45);
        if (lake != null && x > lake - 4) ht = Math.round(ht * 0.8);
        if (tr) {
            const hw = ht * 0.3 + 1;
            if (x + hw > tr.x0 - 2 && x - hw < tr.x1 + 2) ht = Math.min(ht, base - (tr.y1 + 3));
        }
        if (ht < 7) continue;
        trees.push({ x, base, ht });
    }
    // Foreground pines.
    const nearX = mob ? [] : comp === "B" ? [Math.round(W * 0.03)] : [Math.round(W * 0.035), Math.round(W * 0.965)];
    const near: { x: number; base: number; ht: number }[] = [];
    nearX.forEach((nx) => {
        let ht = Math.round(H * 0.56 + R() * 10);
        const base = H + 2;
        if (tr) {
            const hw = ht * 0.3 + 1;
            if (nx + hw > tr.x0 - 2 && nx - hw < tr.x1 + 2) ht = Math.min(ht, base - (tr.y1 + 3));
        }
        if (ht > 10) near.push({ x: nx, base, ht });
    });
    trees
        .sort((a, b2) => a.base - b2.base)
        .forEach((t) => {
            const dc = Math.abs(t.x - cx);
            const lit = night && dc < 70;
            pine(
                land,
                t.x,
                t.base,
                t.ht,
                { b: T.pine, hi: lit ? T.fireHi : T.pineHi, sh: T.pineSh, tr: T.trunk },
                lit ? (t.x < cx ? 1 : -1) : 1,
            );
        });
    near.forEach((t) =>
        pine(
            land,
            t.x,
            t.base,
            t.ht,
            { b: night ? "#0a1716" : "#285e38", hi: T.pineHi, sh: T.pineSh, tr: T.trunk },
            t.x < W / 2 ? 1 : -1,
        ),
    );
    // Owl perch.
    if (night) {
        const target = mob ? (comp === "B" ? 6 : W - 8) : comp === "B" ? W * 0.18 : W * 0.88;
        const cand = trees
            .concat(near)
            .filter((t) => t.ht >= 24 && Math.abs(t.x - cx) > 46 && (lake == null || t.x < lake - 6));
        let best: { x: number; base: number; ht: number } | null = null;
        cand.forEach((t) => {
            if (!best || Math.abs(t.x - target) < Math.abs(best.x - target)) best = t;
        });
        if (best) {
            const bt = best as { x: number; base: number; ht: number };
            const oy = bt.base - Math.round(bt.ht * 0.5) - 8;
            const ox = bt.x - 6;
            if (!inText(ox + 3, oy + 4, 2)) {
                land.grp();
                land.r(ox - 2, oy + 8, 9, 1, "#3a2616");
                land.r(ox + 6, oy + 8, 3, 1, T.trunk);
                I.owl = { x: ox, y: oy };
            }
        }
    }
    // Bottom soil edge.
    land.grp();
    land.r(0, H - 2, W, 2, T.dirt);
    for (let xx = 0; xx < W; xx += 1 + Math.floor(R() * 3)) land.r(xx, H - 2, 1, 1, T.gDark);

    // Mid objects: log pile, tent, stones, logs.
    const fy = campY - 1;
    mid.grp();
    const px = I.chX - 5;
    mid.r(px - 1, campY - 5, 8, 5, T.woodD);
    (
        [
            [px, campY - 2],
            [px + 3, campY - 2],
            [px + 1, campY - 5],
            [px + 4, campY - 5],
        ] as const
    ).forEach(([a, c2]) => {
        mid.r(a, c2, 3, 2, T.ring);
        mid.r(a + 1, c2, 1, 1, T.woodD);
    });
    const tc = T.tent;
    const fx = cx + (mob ? 22 : 26);
    const by = campY - 3;
    const hw = mob ? 9 : 11;
    const ht = mob ? 16 : 19;
    const d = mob ? 8 : 12;
    const ty = by - ht;
    mid.grp();
    mid.r(fx - hw - 2, by, 2 * hw + d + 5, 1, tc.sh);
    for (let y = ty; y < by; y++) {
        const half = Math.round((hw * (y - ty)) / ht);
        mid.r(fx + half + 1, y, d, 1, tc.s);
    }
    for (let y = ty; y < by; y++) {
        const half = Math.round((hw * (y - ty)) / ht);
        mid.r(fx + Math.round(d / 2) + half + 1, y, 1, 1, tc.sd);
    }
    for (let y = ty; y < by; y++) {
        const half = Math.round((hw * (y - ty)) / ht);
        mid.r(fx - half, y, 2 * half + 1, 1, tc.f);
        mid.r(fx - half, y, 1, 1, tc.h);
        if (night && half > 2) mid.r(fx - half + 1, y, Math.round(half * 0.5), 1, tc.fl);
    }
    mid.r(fx, ty, d + 1, 1, tc.h);
    const yd = ty + Math.round(ht * 0.32);
    for (let y = yd; y < by; y++) {
        const dh = Math.round((hw * 0.5 * (y - yd)) / (by - yd));
        mid.r(fx - dh, y, 2 * dh + 1, 1, tc.i);
        mid.r(fx + dh + 1, y, 1, 1, tc.s);
    }
    if (night) mid.r(fx - 1, by - 3, 3, 2, tc.l);
    mid.line(fx - 1, ty + 1, fx - hw - 6, by, tc.rope);
    mid.line(fx + d, ty, fx + d + hw + 4, by - 1, tc.rope);
    mid.r(fx - hw - 6, by - 1, 1, 2, tc.wd);
    mid.r(fx + d + hw + 4, by - 2, 1, 2, tc.wd);
    I.tent = { fx, by, hw, d };
    mid.grp();
    [-8, -5, -2, 1, 4, 7].forEach((i) => {
        mid.r(cx + i, fy - 3, 3, 1, night ? "#6e5244" : T.stoneHi);
        mid.r(cx + i, fy - 2, 3, 1, T.stone);
    });
    mid.grp();
    for (let k = 0; k < 2; k++) {
        mid.line(cx - 7, fy - k, cx + 5, fy - 3 - k, k ? T.wood : T.woodD);
        mid.line(cx + 7, fy - k, cx - 5, fy - 3 - k, k ? T.wood : T.woodD);
    }
    mid.r(cx - 8, fy - 1, 2, 2, T.ring);
    mid.r(cx + 7, fy - 1, 2, 2, T.ring);
    // Static lit tufts inside the fire pool.
    for (let i = 0; i < 26; i++) {
        const a = R() * Math.PI * 2;
        const rr = Math.sqrt(R());
        I.tufts.push({ x: Math.round(cx + Math.cos(a) * rr * 30), y: Math.round(campY + 1 + Math.sin(a) * rr * 7) });
    }
    return { sky, land, mid, I };
}

function flame(p: Pt, cx: number, fy: number, Hf: number, hw: number, f: number) {
    p.grp();
    for (let r = 0; r < Hf; r++) {
        const q = r / Hf;
        const y = fy - r;
        const sway = Math.round(Math.sin(q * 3.2 + f * 1.05) * 1.6 * q);
        const w = Math.max(0, Math.round(hw * Math.pow(1 - q, 0.75) + (hh(r, f + 3) - 0.5) * 2.2));
        if (w <= 0 && q > 0.6) continue;
        p.r(cx + sway - w, y, 2 * w + 1, 1, "#c74707");
        const wm = Math.round(w * 0.68 - (q > 0.7 ? 1 : 0));
        if (q < 0.82 && wm >= 0) p.r(cx + sway - wm, y, 2 * wm + 1, 1, "#ff9a3c");
        const wi = Math.round(w * 0.36);
        if (q < 0.55) p.r(cx + sway - wi, y, 2 * wi + 1, 1, "#efe37f");
        if (q < 0.2) {
            const wc = Math.round(w * 0.12);
            p.r(cx - wc, y, 2 * wc + 1, 1, "#fff6d0");
        }
    }
    for (let j = 0; j < 2; j++)
        if (hh(j + 40, f) > 0.35) {
            const tx = cx + Math.round((hh(j + 50, f) - 0.5) * 6);
            const tyy = fy - Hf - 1 - Math.floor(hh(j + 60, f) * 3);
            p.r(tx, tyy, 1, 2, "#c74707");
            p.r(tx, tyy + 1, 1, 1, "#ff9a3c");
        }
}

export function paintDyn(I: SceneInfo, t: number, th: Theme, frozen: boolean) {
    const T = TH[th];
    const night = th === "night";
    const S = new Pt();
    const L = new Pt();
    const F = new Pt();
    const { W, H, gy, cx, campY, moon, lake } = I;
    const fy = campY - 1;
    // Sky.
    if (night) {
        S.grp();
        I.stars.forEach((s) => S.r(s.x, s.y, 1, 1, (t + s.ph) % s.p > 1 ? "#e6eaff" : "#3e4880"));
        I.cross.forEach((s) => {
            const big = (t + s.ph) % s.p > 3;
            S.r(s.x, s.y, 1, 1, "#ffffff");
            if (big) {
                S.r(s.x - 1, s.y, 1, 1, "#9aa6e0");
                S.r(s.x + 1, s.y, 1, 1, "#9aa6e0");
                S.r(s.x, s.y - 1, 1, 1, "#9aa6e0");
                S.r(s.x, s.y + 1, 1, 1, "#9aa6e0");
            }
        });
        const k = t % 140;
        if (!frozen && k < 10) {
            S.grp();
            const hx = I.ss.x + k * 5;
            const hy = I.ss.y + k * 2;
            for (let j = 6; j >= 0; j--) {
                if (k > 7 && j < k - 7) continue;
                S.r(hx - Math.round(j * 2.5), hy - j, j ? 2 : 1, 1, j < 2 ? "#ffffff" : j < 4 ? "#b8c4ff" : "#5a68a8");
            }
        }
    } else {
        S.grp();
        const k = (t >> 3) % 2;
        (
            [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
                [0.7, 0.7],
                [-0.7, 0.7],
                [0.7, -0.7],
                [-0.7, -0.7],
            ] as const
        ).forEach(([dx, dy], i) => {
            const len = 2 + ((i + k) % 2);
            for (let j = 0; j < len; j++)
                S.r(
                    moon.x + Math.round(dx * (moon.r + 3 + j)),
                    moon.y + Math.round(dy * (moon.r + 3 + j)),
                    1,
                    1,
                    "#ffd84a",
                );
        });
        I.clouds.forEach((c) => {
            S.grp();
            const x = ((c.x0 + Math.floor(t / 5)) % (W + 50)) - 25;
            S.r(x, c.y, c.w, 3, "#ffffff");
            S.circ(x + 4, c.y, 3, "#ffffff");
            S.circ(x + Math.round(c.w * 0.45), c.y - 1, 4, "#ffffff");
            S.circ(x + c.w - 5, c.y, 3, "#ffffff");
            S.r(x + 1, c.y + 3, c.w - 2, 1, "#cfe8f7");
        });
        const per = Math.round(W / 2) + 120;
        const k2 = t % per;
        if (!frozen && k2 < W / 2 + 20) {
            S.grp();
            const wf = (t >> 1) % 2;
            (
                [
                    [0, 0],
                    [-5, 2],
                    [-9, -1],
                    [-13, 3],
                ] as const
            ).forEach(([ox, oy]) => {
                const bx = -4 + k2 * 2 + ox;
                const byy = 20 + oy + Math.round(Math.sin(k2 / 8) * 1.5);
                const c = "#2a2f3a";
                if (wf) {
                    S.r(bx, byy, 1, 1, c);
                    S.r(bx + 4, byy, 1, 1, c);
                    S.r(bx + 1, byy + 1, 1, 1, c);
                    S.r(bx + 3, byy + 1, 1, 1, c);
                    S.r(bx + 2, byy + 2, 1, 1, c);
                } else {
                    S.r(bx + 2, byy, 1, 1, c);
                    S.r(bx + 1, byy + 1, 3, 1, c);
                    S.r(bx, byy + 2, 1, 1, c);
                    S.r(bx + 4, byy + 2, 1, 1, c);
                }
            });
        }
    }
    // Light pool and lake.
    const f6 = t % 6;
    const throwP = t % 240;
    const boost = !frozen && throwP >= 212 && throwP < 232;
    if (night) {
        const fl = [0, 1, 0, -1, 1, 0][f6] + (boost ? 3 : 0);
        const jit = (y: number) => (hh(y + 30, f6) > 0.75 ? 1 : 0);
        const xm = lake != null && I.lakeRow ? (y: number) => I.lakeRow!(y) - 1 : null;
        L.grp();
        L.ell(cx, campY + 1, 36 + fl, 9, L.dz(T.ground, "#2c2a1c"), jit, xm);
        L.grp();
        L.ell(cx, campY + 1, 25 + fl, 6, "#2c2a1c", jit, xm);
        I.tufts.forEach((p) => L.r(p.x, p.y, 1, 1, "#3e3622"));
        L.grp();
        L.ell(cx, campY + 1, 15 + fl, 4, "#43361f", jit);
        L.ell(cx, campY + 1, 8, 2, "#5e4524");
        L.grp();
        L.r(I.chX - 4, campY + 1, 16, 1, "#1a1a12");
        L.r(I.chX - 2, campY + 2, 10, 1, "#1a1a12");
    } else {
        L.grp();
        L.ell(cx, campY + 1, 10, 2, "#4a6a34");
        L.ell(cx, campY + 1, 5, 1, "#5a5a4a");
    }
    if (lake != null && I.lakeRow) {
        L.grp();
        const k = t >> 2;
        I.ripples.forEach((r, i) => L.r(r.x + ((k + i) % 3) - 1, r.y, r.w, 1, T.ripple));
        if (moon.x > lake - 10)
            for (let y = gy + 2; y < H - 4; y += 2) {
                const xl = I.lakeRow(y);
                const w = 1 + Math.floor(hh(y, k) * 4);
                const j = Math.floor(hh(y + 99, k) * 3) - 1;
                const mx = moon.x + j;
                if (mx - w > xl) L.r(mx - w, y, 2 * w, 1, y - gy < (H - gy) * 0.5 ? T.refl : T.refl2);
            }
    }
    // Character: typing, blinking and reaching for a log every 24 seconds.
    const reach = !frozen && throwP >= 200 && throwP < 214;
    const tf = Math.floor(t / 2) % 10;
    const fk = reach ? "R" : tf < 8 && tf % 2 ? "B" : "A";
    const rows = CH.slice();
    Object.entries(FR[fk]).forEach(([k, row]) => {
        rows[Number(k)] = row;
    });
    if (!frozen && t % 45 === 0 && !reach) rows[6] = rows[6].replace(/E/g, "s");
    F.grp();
    F.spr(rows, CP[th], I.chX, I.chY);
    if (night) {
        F.grp();
        F.r(I.chX + 16, I.chY + 19, 1, 1, "#7affc0");
    }
    // Thrown log.
    if (!frozen && throwP >= 204 && throwP < 212) {
        const k = throwP - 204;
        const x0 = I.chX + 21;
        const y0 = I.chY + 13;
        const x1 = cx - 2;
        const y1 = fy - 4;
        const lx = Math.round(x0 + ((x1 - x0) * k) / 7);
        const ly = Math.round(y0 + ((y1 - y0) * k) / 7 - 6 * Math.sin((Math.PI * k) / 7));
        F.grp();
        F.r(lx, ly, 4, 2, T.wood);
        F.r(lx + 3, ly, 1, 2, T.ring);
    }
    // Fire.
    const Hf = (I.mob ? 13 : 15) + (boost ? 6 : 0);
    if (night) flame(F, cx, fy - 1, Hf, 6, f6);
    else flame(F, cx, fy - 1, 5, 3, f6);
    F.grp();
    for (let j = 0; j < 5; j++)
        F.r(
            cx - 5 + j * 2 + (hh(j, t >> 1) > 0.5 ? 1 : 0),
            fy - 1,
            1,
            1,
            hh(j + 9, t >> 1) > 0.4 ? "#ff6a1a" : "#c74707",
        );
    if (night) {
        F.grp();
        const n = boost ? 16 : 10;
        for (let i = 0; i < n; i++) {
            const per = 18 + (i % 5) * 2;
            const cyc = Math.floor((t + i * 7) / per);
            const age = (t + i * 7) % per;
            if (age > per - 2) continue;
            const sx = cx + Math.round((hh(i, cyc) - 0.5) * 8) + Math.round(Math.sin((age + i) * 0.6) * 1.5);
            const sy = fy - Hf + 4 - Math.round(age * 1.6);
            F.r(sx, sy, 1, 1, age < 5 ? "#ffe9a0" : age < 10 ? "#ff9a3c" : "#c74707");
        }
    } else {
        for (let i = 0; i < 4; i++) {
            F.grp();
            const age = (t + i * 8) % 32;
            const s = 1 + (age > 10 ? 1 : 0) + (age > 22 ? 1 : 0);
            const sx = cx + Math.round(Math.sin(age / 5 + i) * 2) + (age >> 3);
            const sy = fy - 6 - Math.round(age * 1.3);
            F.r(sx, sy, s, s, age < 16 ? "#8f98a3" : "#b7bfc8");
        }
    }
    F.grp();
    [-10, -6, -2, 2, 6, 10].forEach((i) => {
        F.r(cx + i - 1, fy + 1, 3, 1, T.stoneHi);
        F.r(cx + i - 1, fy + 2, 3, 1, T.stone);
    });
    if (night && I.owl) {
        const blink = !frozen && t % 70 < 2;
        const turn = !frozen && t % 180 >= 120 && t % 180 < 150;
        const o = OWL.slice();
        if (blink) {
            o[2] = "ooooooo";
            o[3] = "oddoddo";
        } else if (turn) o[3] = "oKYoKYo";
        F.grp();
        F.spr(o, OWLP, I.owl.x, I.owl.y);
    }
    return { S, L, F };
}

// ── Footer strip: the camp after everyone went to sleep ──

export type EmbersInfo = {
    W: number;
    cx: number;
    fy: number;
    fx: number;
    ty: number;
    stars: { x: number; y: number; p: number; ph: number }[];
    base: Pt;
};

export const EMBERS_HEIGHT = 40;

export function paintEmbersStatic(W: number, th: Theme): EmbersInfo {
    const H = EMBERS_HEIGHT;
    const night = th === "night";
    const T = TH[th];
    const R = rng(9);
    const p = new Pt();
    const gy = 28;
    p.grp();
    p.r(0, 0, W, 12, T.sky[0]);
    p.r(0, 12, W, 9, T.sky[1]);
    p.r(0, 21, W, gy - 21, T.sky[2]);
    p.r(0, 10, W, 2, p.dz(T.sky[0], T.sky[1]));
    p.r(0, 19, W, 2, p.dz(T.sky[1], T.sky[2]));
    const stars: EmbersInfo["stars"] = [];
    if (night) {
        p.grp();
        for (let i = 0; i < W / 5; i++) {
            const x = Math.floor(R() * W);
            const y = 1 + Math.floor(R() * 18);
            if (R() < 0.3) stars.push({ x, y, p: 20 + Math.floor(R() * 30), ph: Math.floor(R() * 40) });
            else p.r(x, y, 1, 1, R() < 0.3 ? "#9aa4d4" : "#4e5890");
        }
    }
    p.grp();
    for (let x = 0; x < W; x++) {
        const top = gy - Math.round(4 + 2 * Math.sin(x / 19 + 1) + 1.5 * Math.sin(x / 7));
        p.r(x, top, 1, gy - top, T.hill);
    }
    p.grp();
    for (let x = 0; x < W + 4; x += 2 + Math.floor(R() * 4))
        pine(p, x, gy + 1, 4 + Math.floor(R() * 7), { b: T.far, tr: T.far }, 1, true);
    p.grp();
    p.r(0, gy, W, H - gy, T.ground);
    p.r(0, gy, W, 1, T.gDark);
    for (let i = 0; i < W * 1.2; i++)
        p.r(Math.floor(R() * W), gy + 2 + Math.floor(R() * (H - gy - 3)), 1, 1, R() < 0.5 ? T.gLite : T.gDark);
    const cx = Math.round(W / 2);
    const fy = gy + 6;
    // Sleeping tent, left of the fire.
    const tc = T.tent;
    const fx = cx - 26;
    const by = fy;
    const hw2 = 10;
    const ht = 16;
    const d = 10;
    const ty = by - ht;
    p.grp();
    p.r(fx - hw2 - 2, by, 2 * hw2 + d + 5, 1, tc.sh);
    for (let y = ty; y < by; y++) {
        const half = Math.round((hw2 * (y - ty)) / ht);
        p.r(fx - half - d, y, d, 1, tc.s);
    }
    for (let y = ty; y < by; y++) {
        const half = Math.round((hw2 * (y - ty)) / ht);
        p.r(fx - half, y, 2 * half + 1, 1, tc.f);
        p.r(fx + half, y, 1, 1, tc.h);
        if (night && half > 2) p.r(fx + Math.round(half * 0.4), y, Math.round(half * 0.6), 1, tc.fl);
    }
    p.r(fx - d, ty, d + 1, 1, tc.h);
    for (let y = ty + 5; y < by; y++) p.r(fx, y, 1, 1, tc.sd);
    p.r(fx - 2, by - 5, 1, 1, tc.rope);
    p.r(fx + 2, by - 5, 1, 1, tc.rope);
    p.line(fx + 1, ty + 1, fx + hw2 + 6, by, tc.rope);
    p.r(fx + hw2 + 6, by - 1, 1, 2, tc.wd);
    // Boots outside the tent.
    p.grp();
    p.r(fx + 5, by - 2, 2, 2, "#4e3220");
    p.r(fx + 8, by - 2, 2, 2, "#4e3220");
    p.r(fx + 5, by - 3, 1, 1, "#4e3220");
    p.r(fx + 8, by - 3, 1, 1, "#4e3220");
    // Closed laptop on a stump, right of the fire.
    p.grp();
    const sx = cx + 16;
    p.r(sx, fy - 4, 7, 4, T.wood);
    p.r(sx, fy - 4, 7, 1, T.ring);
    p.r(sx + 2, fy - 4, 1, 1, T.woodD);
    p.r(sx, fy - 1, 7, 1, T.woodD);
    p.r(sx + 1, fy - 5, 5, 1, night ? "#a9adba" : "#c9ccd6");
    p.r(sx + 5, fy - 5, 1, 1, "#00ff88");
    // Stones and charred logs.
    p.grp();
    [-7, -4, -1, 2, 5].forEach((i) => {
        p.r(cx + i, fy - 1, 3, 1, T.stoneHi);
        p.r(cx + i, fy, 3, 1, T.stone);
    });
    p.grp();
    for (let k = 0; k < 2; k++) {
        p.line(cx - 6, fy - 1 - k, cx + 4, fy - 4 - k, k ? "#3a2416" : "#24160c");
        p.line(cx + 6, fy - 1 - k, cx - 4, fy - 4 - k, k ? "#3a2416" : "#24160c");
    }
    p.r(cx - 5, fy - 2, 11, 1, night ? "#3a3a3a" : "#8a8478");
    return { W, cx, fy, fx, ty, stars, base: p };
}

export function paintEmbersDyn(F: EmbersInfo, u: number, th: Theme) {
    const night = th === "night";
    const T = TH[th];
    const q = new Pt();
    if (night) {
        q.grp();
        F.stars.forEach((s) => q.r(s.x, s.y, 1, 1, (u + s.ph) % s.p > 1 ? "#e6eaff" : "#3e4880"));
        q.grp();
        q.ell(F.cx, F.fy, 12 + (u % 6 === 0 ? 1 : 0), 2, q.dz(T.ground, "#2c2a1c"));
        q.ell(F.cx, F.fy, 7, 1, "#3a2e1c");
    }
    // Embers and a last little flame.
    q.grp();
    for (let j = 0; j < 9; j++) {
        const on = hh(j, u >> 1) > 0.35;
        if (on)
            q.r(
                F.cx - 4 + j,
                F.fy - 2 - (j % 3 === 1 ? 1 : 0),
                1,
                1,
                hh(j + 5, u >> 1) > 0.7 ? "#ffd27a" : hh(j + 9, u >> 1) > 0.4 ? "#ff6a1a" : "#c74707",
            );
    }
    const fh = night ? 2 + Math.floor(hh(1, u) * 3) : 1;
    q.r(F.cx, F.fy - 3 - fh, 1, fh, "#ff9a3c");
    q.r(F.cx, F.fy - 3, 1, 1, "#efe37f");
    if (night && hh(2, u) > 0.5) q.r(F.cx - 1, F.fy - 4, 1, 1, "#c74707");
    // Smoke curl.
    for (let i = 0; i < 3; i++) {
        q.grp();
        const age = (u + i * 12) % 36;
        const s = age > 20 ? 2 : 1;
        q.r(
            F.cx + Math.round(Math.sin(age / 5 + i) * 2) + (age >> 3),
            F.fy - 6 - age,
            s,
            s,
            age < 18 ? (night ? "#5a5f6a" : "#8f98a3") : night ? "#3e4352" : "#b7bfc8",
        );
    }
    // Zzz from the tent.
    const Z = ["#####", "...#.", "..#..", ".#...", "#####"];
    for (let i = 0; i < 3; i++) {
        const age = (u + i * 14) % 42;
        if (age > 34) continue;
        q.grp();
        const zx = F.fx - 2 - (age >> 2) - i;
        const zy = F.ty - 3 - (age >> 1);
        q.spr(Z, { "#": night ? "#c8d0f0" : "#2a3570" }, zx, zy);
    }
    return q;
}

export function currentTheme(): Theme {
    return document.documentElement.classList.contains("light") ? "day" : "night";
}

export function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
