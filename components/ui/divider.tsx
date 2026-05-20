export default function Divider() {
    return (
        <div className="flex items-center justify-center py-2">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-accent-foreground/30"></div>
            <div className="mx-3 size-1.5 rotate-45 border border-accent-foreground/40"></div>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-accent-foreground/30"></div>
        </div>
    );
}
