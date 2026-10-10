import { getTranslations } from "next-intl/server";
import AboutDialog from "./about-dialog";
import SectionHeading from "@/components/pixel/section-heading";
import { SideCircuit } from "@/components/pixel/circuit-deco";

const PARAGRAPH_KEYS = ["about_p1", "about_p2", "about_p3", "about_p4", "about_p5"] as const;

export default async function About() {
    const t = await getTranslations("about");
    const paragraphs = PARAGRAPH_KEYS.map((key) => t(key));
    return (
        <section id="about" className="relative py-24">
            <SideCircuit side="left" phase={0} />
            <div className="flex flex-col items-center gap-10">
                <SectionHeading className="text-center">{t("title")}</SectionHeading>
                <AboutDialog
                    paragraphs={paragraphs}
                    labels={{
                        speaker: t("dialog_speaker"),
                        next: t("dialog_next"),
                        previous: t("dialog_previous"),
                        showAll: t("dialog_show_all"),
                        showDialog: t("dialog_show_dialog"),
                        advance: t("dialog_advance"),
                        pages: paragraphs.map((_, i) => t("dialog_page", { current: i + 1, total: paragraphs.length })),
                    }}
                />
            </div>
        </section>
    );
}
