// Each row is a string; every character maps to a palette color, "." (or any unmapped char) is transparent.
export type Sprite = { rows: string[]; palette: Record<string, string> };

// Renders a sprite as crisp SVG rects, merging horizontal runs of the same color.
export default function PixelSprite({ sprite, className = "" }: { sprite: Sprite; className?: string }) {
    const width = Math.max(...sprite.rows.map((r) => r.length));
    const rects: { x: number; y: number; w: number; fill: string }[] = [];

    sprite.rows.forEach((row, y) => {
        let x = 0;
        while (x < row.length) {
            const c = row[x];
            let run = 1;
            while (row[x + run] === c) run++;
            if (sprite.palette[c]) rects.push({ x, y, w: run, fill: sprite.palette[c] });
            x += run;
        }
    });

    return (
        <svg
            viewBox={`0 0 ${width} ${sprite.rows.length}`}
            shapeRendering="crispEdges"
            aria-hidden="true"
            className={className}
        >
            {rects.map((r, i) => (
                <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
            ))}
        </svg>
    );
}
