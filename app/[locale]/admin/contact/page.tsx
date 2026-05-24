import { getAllContactForm } from "@/lib/server/contact-form";
import ContactList from "@/components/admin/contact-list";

export default async function ContactPage() {
    const { data } = await getAllContactForm({ limit: 50 });

    return (
        <div className="flex flex-col gap-8">
            <h1 className="font-mono text-2xl font-bold text-primary">İletişim Formları</h1>
            <ContactList contacts={data?.contactForm ?? []} />
        </div>
    );
}
