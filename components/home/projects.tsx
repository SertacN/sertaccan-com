import { getFeaturedProjects } from "@/lib/server/projects";
import { ProjectCardItem } from "../ui/project-card";
import ProjectSlider from "./project-slider";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

// Cards beyond the first viewport are off-screen, so their images can load lazily.
const EAGER_IMAGE_COUNT = 3;

export default async function Projects() {
    const { data } = await getFeaturedProjects();
    const projects = data ?? [];
    const t = await getTranslations("home_projects");
    return (
        <section id="projects" className="py-24">
            <div className="flex flex-col gap-7">
                <ProjectSlider
                    heading={t("title")}
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
                <Link
                    href="/projects"
                    className="self-center font-mono text-sm font-bold text-primary hover:text-foreground"
                >
                    {t("see_all")}
                </Link>
            </div>
        </section>
    );
}
