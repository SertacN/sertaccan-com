// Pixel icons from the Pixel Camp design. Each icon is a list of [x, y, w, h] rects on a tiny grid.

type Rect = readonly [number, number, number, number];

function PixelIcon({
    rects,
    grid,
    size,
    className,
}: {
    rects: readonly Rect[];
    grid: readonly [number, number];
    size: readonly [number, number];
    className?: string;
}) {
    return (
        <svg
            width={size[0]}
            height={size[1]}
            viewBox={`0 0 ${grid[0]} ${grid[1]}`}
            shapeRendering="crispEdges"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            {rects.map(([x, y, w, h], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} />
            ))}
        </svg>
    );
}

type IconProps = { className?: string };

const SUN: Rect[] = [
    [2, 2, 4, 4],
    [3, 0, 2, 1],
    [3, 7, 2, 1],
    [0, 3, 1, 2],
    [7, 3, 1, 2],
    [1, 1, 1, 1],
    [6, 1, 1, 1],
    [1, 6, 1, 1],
    [6, 6, 1, 1],
];
const MOON: Rect[] = [
    [2, 0, 3, 1],
    [1, 1, 2, 1],
    [0, 2, 2, 3],
    [0, 5, 3, 1],
    [5, 5, 2, 1],
    [1, 6, 6, 1],
    [2, 7, 4, 1],
];
const MENU: Rect[] = [
    [0, 0, 8, 1],
    [0, 3, 8, 1],
    [0, 6, 8, 1],
];
const MAIL: Rect[] = [
    [0, 0, 8, 1],
    [0, 5, 8, 1],
    [0, 0, 1, 6],
    [7, 0, 1, 6],
    [1, 1, 1, 1],
    [6, 1, 1, 1],
    [2, 2, 1, 1],
    [5, 2, 1, 1],
    [3, 3, 2, 1],
];
const ARROW_LEFT: Rect[] = [
    [5, 0, 1, 8],
    [4, 1, 1, 6],
    [3, 2, 1, 4],
    [2, 3, 1, 2],
];
const ARROW_RIGHT: Rect[] = [
    [2, 0, 1, 8],
    [3, 1, 1, 6],
    [4, 2, 1, 4],
    [5, 3, 1, 2],
];
const ARROW_DOWN: Rect[] = [
    [0, 2, 8, 1],
    [1, 3, 6, 1],
    [2, 4, 4, 1],
    [3, 5, 2, 1],
];
const CHECK: Rect[] = [
    [6, 1, 2, 1],
    [5, 2, 2, 1],
    [4, 3, 2, 1],
    [0, 3, 2, 1],
    [1, 4, 4, 1],
    [2, 5, 2, 1],
];
const SWORD: Rect[] = [
    [6, 0, 2, 1],
    [7, 1, 1, 1],
    [5, 1, 2, 1],
    [4, 2, 2, 1],
    [3, 3, 2, 1],
    [1, 3, 1, 1],
    [2, 4, 2, 1],
    [4, 5, 1, 1],
    [1, 5, 2, 1],
    [0, 6, 2, 1],
    [0, 7, 1, 1],
];
const ARCHIVE: Rect[] = [
    [0, 0, 8, 2],
    [1, 2, 1, 4],
    [6, 2, 1, 4],
    [2, 3, 3, 1],
    [2, 5, 2, 1],
    [0, 6, 8, 2],
];

export const SunIcon = ({ className }: IconProps) => (
    <PixelIcon rects={SUN} grid={[8, 8]} size={[16, 16]} className={className} />
);
export const MoonIcon = ({ className }: IconProps) => (
    <PixelIcon rects={MOON} grid={[8, 8]} size={[16, 16]} className={className} />
);
export const MenuIcon = ({ className }: IconProps) => (
    <PixelIcon rects={MENU} grid={[8, 7]} size={[16, 14]} className={className} />
);
export const MailIcon = ({ className }: IconProps) => (
    <PixelIcon rects={MAIL} grid={[8, 6]} size={[16, 12]} className={className} />
);
export const ArrowLeftIcon = ({ className }: IconProps) => (
    <PixelIcon rects={ARROW_LEFT} grid={[8, 8]} size={[16, 16]} className={className} />
);
export const ArrowRightIcon = ({ className }: IconProps) => (
    <PixelIcon rects={ARROW_RIGHT} grid={[8, 8]} size={[16, 16]} className={className} />
);
export const ArrowDownIcon = ({ className }: IconProps) => (
    <PixelIcon rects={ARROW_DOWN} grid={[8, 8]} size={[16, 16]} className={className} />
);
export const EndIcon = ({ className }: IconProps) => (
    <PixelIcon rects={[[0, 0, 3, 3]]} grid={[3, 3]} size={[12, 12]} className={className} />
);
export const ErrorMarkIcon = ({ className }: IconProps) => (
    <PixelIcon rects={[[0, 0, 1, 2]]} grid={[1, 3]} size={[4, 12]} className={className} />
);

// Quest-style project status icons.
export const STATUS_ICONS = {
    ACTIVE: ({ className }: IconProps) => (
        <PixelIcon rects={CHECK} grid={[8, 8]} size={[16, 16]} className={className} />
    ),
    WIP: ({ className }: IconProps) => <PixelIcon rects={SWORD} grid={[8, 8]} size={[16, 16]} className={className} />,
    ARCHIVED: ({ className }: IconProps) => (
        <PixelIcon rects={ARCHIVE} grid={[8, 8]} size={[16, 16]} className={className} />
    ),
} as const;
