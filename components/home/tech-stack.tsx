import { Tech, techstack } from "@/lib/tech-stack";
import { getTechIcon } from "@/utils/tech-icon";
import { getTranslations } from "next-intl/server";
import SectionHeading from "@/components/pixel/section-heading";
import TechIcon from "@/components/pixel/tech-icon";
import { MergeWire, SideCircuit } from "@/components/pixel/circuit-deco";

const categories = ["Frontend", "Backend", "Database", "DevOps", "Mobile"] as const;
const grouped = categories.reduce(
    (acc, cat) => {
        acc[cat] = techstack.filter((t) => t.category === cat);
        return acc;
    },
    {} as Record<string, Tech[]>,
);

// Highlighted core tools; `name` must match a key known to getTechIcon.
const MAIN_STACK = [
    { name: "Node.js", label: "Node.js", category: "Backend", descKey: "main_backend" },
    { name: "NextJS", label: "Next.js", category: "Frontend", descKey: "main_frontend" },
] as const;

const LEVELS: Tech["level"][] = ["advanced", "intermediate", "beginner"];
const LEVEL_PIPS: Record<Tech["level"], number> = { advanced: 3, intermediate: 2, beginner: 1 };

// Level shown as three pixel pips, so it does not rely on color or opacity alone.
function Pips({ level }: { level: Tech["level"] }) {
    return (
        <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className={`size-2 ${
                        i < LEVEL_PIPS[level]
                            ? "bg-primary shadow-[inset_0_0_0_2px_var(--primary)]"
                            : "shadow-[inset_0_0_0_2px_var(--muted-foreground)]"
                    }`}
                />
            ))}
        </span>
    );
}

export default async function TechStack() {
    const t = await getTranslations("tech_stack");
    return (
        <section id="techstack" className="relative py-24">
            <SideCircuit side="right" phase={3} />
            <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-end justify-between gap-5">
                    <SectionHeading>{t("title")}</SectionHeading>
                    <div className="flex flex-wrap gap-5">
                        {LEVELS.map((level) => (
                            <div key={level} className="flex items-center gap-2">
                                <span aria-hidden="true">
                                    <Pips level={level} />
                                </span>
                                <span className="font-mono text-xs font-bold text-muted-foreground">
                                    {t(`level_${level}`)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        {t("main_gear")}
                    </h3>
                    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">
                        {MAIN_STACK.map((item) => (
                            <li
                                key={item.name}
                                className="frame-4 m-1 flex items-center gap-5 bg-card p-6 [--frame:var(--primary)]"
                            >
                                <div className="frame-2 m-0.5 flex size-18 shrink-0 items-center justify-center bg-background [--frame:var(--pixel-line)]">
                                    <TechIcon icon={getTechIcon(item.name)} name={item.name} size={40} />
                                </div>
                                <div className="flex min-w-0 flex-col gap-2">
                                    <span
                                        lang="en"
                                        className="font-mono text-xs font-bold tracking-widest text-primary uppercase"
                                    >
                                        {item.category}
                                    </span>
                                    <span className="font-pixel text-[44px] leading-[0.9] text-foreground">
                                        {item.label}
                                    </span>
                                    <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                                        {t(item.descKey)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <MergeWire />

                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
                    {categories.map((category) => {
                        const items = grouped[category];
                        if (!items.length) return null;
                        return (
                            <div
                                key={category}
                                className="frame-4 m-1 flex flex-col gap-4 bg-card p-5 [--frame:var(--pixel-line)]"
                            >
                                <h3
                                    lang="en"
                                    className="font-mono text-xs font-bold tracking-widest text-primary uppercase"
                                >
                                    {category}
                                </h3>
                                <ul className="flex flex-wrap gap-2">
                                    {items.map((tech) => (
                                        <li
                                            key={tech.name}
                                            className="frame-2 m-0.5 flex h-8.5 items-center gap-2 bg-background px-2.5 transition-transform [--frame:var(--pixel-line)] hover:-translate-y-0.5 hover:[--frame:var(--primary)]"
                                        >
                                            <TechIcon icon={getTechIcon(tech.name)} name={tech.name} size={14} />
                                            <span className="font-mono text-[13px] font-bold text-foreground">
                                                {tech.name}
                                            </span>
                                            <span
                                                role="img"
                                                aria-label={t(`level_${tech.level}`)}
                                                title={t(`level_${tech.level}`)}
                                            >
                                                <Pips level={tech.level} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
