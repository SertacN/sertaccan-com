import SiteShell from "@/components/layout/site-shell";
import NotFoundContent from "@/components/not-found-content";

// Reached when the locale layout itself bails out (e.g. /ads.txt), so it renders the site shell on its own.
export default function NotFound() {
    return (
        <SiteShell>
            <NotFoundContent />
        </SiteShell>
    );
}
