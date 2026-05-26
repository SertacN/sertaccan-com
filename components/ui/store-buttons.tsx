import { siAppstore, siAndroid } from "simple-icons";
import Link from "next/link";

interface StoreButtonsProps {
    appStoreUrl?: string | null;
    googlePlayUrl?: string | null;
    size?: "sm" | "md";
}

export default function StoreButtons({ appStoreUrl, googlePlayUrl, size = "sm" }: StoreButtonsProps) {
    if (!appStoreUrl && !googlePlayUrl) return null;

    const cls =
        size === "sm"
            ? "inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-primary px-2.5 py-1 font-mono text-xs text-primary transition-colors duration-150 hover:bg-primary/10"
            : "inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-primary px-4 py-2 font-mono text-sm text-primary transition-colors duration-150 hover:bg-primary/10";

    const iconSize = size === "sm" ? 11 : 13;

    return (
        <>
            {appStoreUrl && (
                <Link href={appStoreUrl} target="_blank" rel="noopener noreferrer" className={cls} aria-label="App Store">
                    <svg role="img" viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor" aria-hidden="true">
                        <path d={siAppstore.path} />
                    </svg>
                    App Store
                </Link>
            )}
            {googlePlayUrl && (
                <Link href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Google Play">
                    <svg role="img" viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor" aria-hidden="true">
                        <path d={siAndroid.path} />
                    </svg>
                    Google Play
                </Link>
            )}
        </>
    );
}
