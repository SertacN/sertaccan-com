import { getTranslations } from "next-intl/server";
import SectionHeading from "@/components/pixel/section-heading";
import ContactForm from "./contact-form";
import ContactButtons from "./contact-buttons";
import { SideCircuit } from "@/components/pixel/circuit-deco";

export default async function Contact() {
    const t = await getTranslations("contact_form");
    return (
        <section id="contact" className="relative py-24">
            <SideCircuit side="right" phase={8} />
            <div className="flex flex-col items-center gap-8">
                <SectionHeading className="text-center">{t("title")}</SectionHeading>
                <ContactForm />
                <ContactButtons />
            </div>
        </section>
    );
}
