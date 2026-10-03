import { siAppstore, siAndroid } from "simple-icons";
import Link from "next/link";

interface StoreButtonsProps {
    appStoreUrl?: string | null;
    googlePlayUrl?: string | null;
    size?: "sm" | "md";
    // Appended for screen readers so store links on different cards get distinct names.
    projectName?: string;
}

export default function StoreButtons({ appStoreUrl, googlePlayUrl, size = "sm", projectName }: StoreButtonsProps) {
    if (!appStoreUrl && !googlePlayUrl) return null;

    const cls =
        size === "sm"
            ? "frame-2 m-0.5 inline-flex h-8 items-center gap-1.5 whitespace-nowrap bg-card px-2.5 font-mono text-xs font-bold text-foreground hover:bg-btn-hover hover:text-foreground"
            : "frame-2 m-0.5 inline-flex h-10 items-center gap-2 whitespace-nowrap bg-card px-4 font-mono text-sm font-bold text-foreground hover:bg-btn-hover hover:text-foreground";

    const iconSize = size === "sm" ? 11 : 13;

    return (
        <>
            {appStoreUrl && (
                <Link href={appStoreUrl} target="_blank" rel="noopener noreferrer" className={cls}>
                    <svg role="img" viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor" aria-hidden="true">
                        <path d={siAppstore.path} />
                    </svg>
                    App Store
                    {projectName && <span className="sr-only"> {projectName}</span>}
                </Link>
            )}
            {googlePlayUrl && (
                <Link href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className={cls}>
                    <svg role="img" viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor" aria-hidden="true">
                        <path d={siAndroid.path} />
                    </svg>
                    Google Play
                    {projectName && <span className="sr-only"> {projectName}</span>}
                </Link>
            )}
        </>
    );
}
