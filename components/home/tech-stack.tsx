import { Tech, techstack } from "@/lib/tech-stack";
import { getTechIcon } from "@/utils/tech-icon";

const categories = ["Frontend", "Backend", "Database", "DevOps", "Mobile"] as const;
const grouped = categories.reduce(
    (acc, cat) => {
        acc[cat] = techstack.filter((t) => t.category === cat);
        return acc;
    },
    {} as Record<string, Tech[]>,
);
const levelBg: Record<Tech["level"], string> = {
    advanced: "bg-accent-foreground/8 border-accent-foreground/25 text-accent-foreground",
    intermediate: "bg-accent-foreground/4 border-accent-foreground/15 text-accent-foreground/70",
    beginner: "bg-accent-foreground/2 border-accent-foreground/10 text-accent-foreground/50",
};

export default function TechStack() {
    return (
        <section id="techstack" className="px-4 py-24">
            <h2 className="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">başlık</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                    const items = grouped[category];
                    if (!items.length) return null;
                    return (
                        <div key={category} className="rounded-lg border border-border bg-surface/50 p-5">
                            <h3 className="mb-4 font-mono text-xs tracking-widest text-text uppercase">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {items.map((tech) => {
                                    const icon = getTechIcon(tech.name);
                                    return (
                                        <span
                                            key={tech.name}
                                            className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-xs font-bold transition-all duration-200 hover:-translate-y-px hover:border-accent${levelBg[tech.level]}`}
                                        >
                                            {icon && (
                                                <svg
                                                    role="img"
                                                    viewBox="0 0 24 24"
                                                    width={14}
                                                    height={14}
                                                    fill={`#${icon.hex}`}
                                                    aria-label={icon.title}
                                                >
                                                    <path d={icon.path} />
                                                </svg>
                                            )}
                                            {tech.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
