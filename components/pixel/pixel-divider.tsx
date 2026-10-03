// Section dividers from the Pixel Camp design: ember dashes, a starry line and a strip of grass.
const VARIANTS = {
    ember: {
        className: "h-1 max-w-[320px]",
        style: {
            background:
                "repeating-linear-gradient(90deg, #c74707 0 8px, transparent 8px 12px, #ff9a3c 12px 16px, transparent 16px 24px)",
        },
    },
    stars: {
        className: "h-3 max-w-90",
        style: {
            backgroundImage:
                "repeating-linear-gradient(90deg, var(--muted-foreground) 0 4px, transparent 4px 36px), repeating-linear-gradient(90deg, transparent 0 16px, var(--primary) 16px 20px, transparent 20px 52px)",
            backgroundSize: "100% 4px, 100% 4px",
            backgroundPosition: "0 0, 0 8px",
            backgroundRepeat: "no-repeat",
        },
    },
    grass: {
        className: "h-2 max-w-90",
        style: {
            backgroundImage:
                "repeating-linear-gradient(90deg, #5fa24e 0 4px, transparent 4px 8px, #5fa24e 8px 12px, transparent 12px 20px), linear-gradient(#2e6b40, #2e6b40)",
            backgroundSize: "100% 4px, 100% 4px",
            backgroundPosition: "0 0, 0 4px",
            backgroundRepeat: "no-repeat",
        },
    },
} as const;

export default function PixelDivider({ variant }: { variant: keyof typeof VARIANTS }) {
    const { className, style } = VARIANTS[variant];
    return <div aria-hidden="true" className={`mx-auto ${className}`} style={style} />;
}
