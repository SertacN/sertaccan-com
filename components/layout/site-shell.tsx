import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import LocaleHtmlUpdater from "@/components/providers/locale-html-updater";

// Navbar, page container and footer shared by the locale layout and the root 404 page.
export default async function SiteShell({ children }: { children: React.ReactNode }) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <LocaleHtmlUpdater />
            <Navbar />
            {/* The fixed navbar is 64px tall (60px bar + 4px rule). */}
            <div className="mx-auto box-content max-w-site px-6 pt-16">
                <main className="pb-4">{children}</main>
            </div>
            <Footer />
        </NextIntlClientProvider>
    );
}
