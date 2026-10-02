import { getFeaturedProjects } from "@/lib/server/projects";
import { ProjectCardItem } from "../ui/project-card";
import ProjectSlider from "./project-slider";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

// Cards beyond the first viewport are off-screen, so their images can load lazily.
const EAGER_IMAGE_COUNT = 3;

export default async function Projects() {
    const { data } = await getFeaturedProjects();
    const projects = data ?? [];
    const t = await getTranslations("home_projects");
    return (
        <section id="projects" className="px-4 py-24">
            <h2 className="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">{t("title")}</h2>
            <ProjectSlider
                labels={{
                    region: t("title"),
                    previous: t("previous"),
                    next: t("next"),
                    slides: projects.map((_, i) => t("slide_label", { current: i + 1, total: projects.length })),
                }}
            >
                {projects.map((project, i) => (
                    <ProjectCardItem key={project.slug} project={project} eagerImage={i < EAGER_IMAGE_COUNT} />
                ))}
            </ProjectSlider>
            <div className="mt-10 text-center">
                <Link
                    href="/projects"
                    className="font-mono text-s text-accent-foreground transition-colors duration-150 hover:underline"
                >
                    {t("see_all")}
                </Link>
            </div>
        </section>
    );
}
