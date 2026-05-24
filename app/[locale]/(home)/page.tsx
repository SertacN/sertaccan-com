import { Suspense } from "react";
import About from "@/components/home/about";
import Hero from "@/components/home/hero";
import Projects from "@/components/home/projects";
import TechStack from "@/components/home/tech-stack";
import Divider from "@/components/ui/divider";
import { ProjectGridSkeleton } from "@/components/ui/skeleton";
import ContactButtons from "@/components/home/contact-buttons";
import ContactForm from "@/components/home/contact-form";

export default function HomePage() {
    return (
        <>
            <Hero />
            <Divider />
            <About />
            <Divider />
            <TechStack />
            <Divider />
            <Suspense
                fallback={
                    <section className="px-4 py-24">
                        <ProjectGridSkeleton count={3} />
                    </section>
                }
            >
                <Projects />
            </Suspense>
            <Divider />
            <ContactForm />
            <ContactButtons />
        </>
    );
}
