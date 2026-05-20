import About from "@/components/home/about";
import Hero from "@/components/home/hero";
import TechStack from "@/components/home/tech-stack";
import Divider from "@/components/ui/divider";

export default function HomePage() {
    return (
        <>
            <Hero />
            <Divider />
            <About />
            <Divider />
            <TechStack />
            <Divider />
        </>
    );
}
