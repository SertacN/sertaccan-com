import { getAllProjects } from "@/lib/server/projects";
import ProjectCard from "../ui/project-card";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Projects() {
    const { data } = await getAllProjects({ take: 3, isActive: true });
    const t = await getTranslations("home_projects");
    return (
        <section id="projects" className="px-4 py-24">
            <h2 className="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">{t("title")}</h2>
            <ProjectCard projects={data?.projects ?? []} />
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
