import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PixelSprite, { type Sprite } from "@/components/pixel/pixel-sprite";
import { ArrowLeftIcon } from "@/components/pixel/icons";
import { bigButton } from "@/components/pixel/styles";

// A trail sign with a question mark, pointing back toward camp.
const SIGNPOST: Sprite = {
    rows: [
        "...DDDDDDDDDDDD.",
        "..DwwwwqqqwwwwD.",
        ".DwwwwwwwqwwwwD.",
        "DwwwwwwwqqwwwwD.",
        ".DwwwwwwwwwwwwD.",
        "..DwwwwwqwwwwwD.",
        "...DDDDDDDDDDDD.",
        "........pP......",
        "........pP......",
        "........pP......",
        "........pP......",
        "........pP......",
        "........pP......",
        "........pP......",
        "....g..gpPg..g..",
        "GGGGGGGGGGGGGGGG",
    ],
    palette: {
        D: "#5e3618",
        w: "#a0662f",
        q: "#f4f1e6",
        p: "#7a4a22",
        P: "#5e3618",
        g: "#3f8f3a",
        G: "#2d6a2a",
    },
};

export default async function NotFoundContent() {
    const t = await getTranslations("error");

    return (
        <section className="flex min-h-[70vh] flex-col items-center justify-center gap-10 py-16 text-center">
            <div className="flex items-end gap-6 md:gap-10">
                <PixelSprite sprite={SIGNPOST} className="w-20 md:w-32" />
                <p
                    className="m-0 font-pixel text-[120px] leading-[0.8] tracking-[0.02em] text-name md:text-[200px]"
                    style={{ textShadow: "4px 4px 0 var(--name-shadow)" }}
                >
                    404
                </p>
            </div>

            <div className="frame-dialog m-2 w-full max-w-xl bg-card p-6 text-left md:p-8">
                <h1 className="m-0 font-pixel text-4xl leading-none font-normal tracking-[0.02em] text-foreground md:text-5xl">
                    {t("not_found_title")}
                </h1>
                <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
                    {t("not_found_desc")}
                </p>
                <p className="mt-2 font-mono text-sm font-bold text-primary">&gt; {t("not_found_hint")}</p>
            </div>

            <Link href="/" className={bigButton}>
                <ArrowLeftIcon />
                <span>{t("not_found_cta")}</span>
            </Link>
        </section>
    );
}
