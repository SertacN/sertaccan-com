import { Suspense } from "react";
import About from "@/components/home/about";
import Hero from "@/components/home/hero";
import Projects from "@/components/home/projects";
import TechStack from "@/components/home/tech-stack";
import Contact from "@/components/home/contact";
import PixelDivider from "@/components/pixel/pixel-divider";
import { ProjectSliderSkeleton } from "@/components/ui/skeleton";

export default function HomePage() {
    return (
        <>
            <Hero />
            <About />
            <PixelDivider variant="ember" />
            <TechStack />
            <PixelDivider variant="stars" />
            <Suspense
                fallback={
                    <section className="py-24">
                        <div className="w-full">
                            <ProjectSliderSkeleton count={3} />
                        </div>
                    </section>
                }
            >
                <Projects />
            </Suspense>
            <PixelDivider variant="grass" />
            <Contact />
        </>
    );
}
