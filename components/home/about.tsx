import { getTranslations } from "next-intl/server";

export default async function About() {
    const t = await getTranslations("about");
    return (
        <section id="about" className="px-4 py-24">
            <h2 className="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">{t("title")}</h2>

            <div className="mx-auto max-w-5xl space-y-4 text-sm leading-relaxed text-text md:text-base">
                <p>{t("about_p1")}</p>
                <p>{t("about_p2")}</p>
                <p>{t("about_p3")}</p>
                <p>{t("about_p4")}</p>
                <p>{t("about_p5")}</p>
            </div>
        </section>
    );
}
