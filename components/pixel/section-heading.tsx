export default function SectionHeading({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h2
            className={`m-0 font-pixel text-[52px] leading-none font-normal tracking-[0.02em] text-foreground ${className}`}
        >
            {children}
        </h2>
    );
}
