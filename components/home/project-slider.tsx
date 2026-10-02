"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type SliderLabels = {
    region: string;
    previous: string;
    next: string;
    // One label per slide, e.g. "2 / 5"; also used for the dot buttons.
    slides: string[];
};

// Controls are hidden by breakpoint (not by measuring) so the layout does not shift on hydration.
// Visible slides per breakpoint: 1 on mobile, 2 from md, 3 from lg.
function controlsVisibilityClass(count: number) {
    if (count <= 1) return "hidden";
    if (count <= 2) return "md:hidden";
    if (count <= 3) return "lg:hidden";
    return "";
}

export default function ProjectSlider({ children, labels }: { children: React.ReactNode; labels: SliderLabels }) {
    const slides = Children.toArray(children);
    const trackRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState({ active: 0, pages: slides.length, canPrev: false, canNext: true });

    const measure = useCallback(() => {
        const track = trackRef.current;
        if (!track || track.children.length === 0) return;

        const items = Array.from(track.children) as HTMLElement[];
        const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const canPrev = track.scrollLeft > 1;
        const canNext = track.scrollLeft < maxScroll - 1;
        const visible = Math.max(1, Math.round(track.clientWidth / step));
        const pages = Math.max(1, items.length - visible + 1);
        const active = canNext ? Math.min(Math.round(track.scrollLeft / step), pages - 1) : pages - 1;

        setState((prev) =>
            prev.active === active && prev.pages === pages && prev.canPrev === canPrev && prev.canNext === canNext
                ? prev
                : { active, pages, canPrev, canNext },
        );
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
        };

        measure();
        track.addEventListener("scroll", onScroll, { passive: true });
        const observer = new ResizeObserver(onScroll);
        observer.observe(track);

        return () => {
            cancelAnimationFrame(frame);
            track.removeEventListener("scroll", onScroll);
            observer.disconnect();
        };
    }, [measure]);

    const goTo = (index: number) => {
        const track = trackRef.current;
        if (!track) return;

        const items = Array.from(track.children) as HTMLElement[];
        const target = items[Math.max(0, Math.min(index, items.length - 1))];
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    };

    const controlsClass = controlsVisibilityClass(slides.length);

    return (
        <div role="region" aria-roledescription="carousel" aria-label={labels.region}>
            <div className={`mb-4 flex justify-end gap-2 ${controlsClass}`}>
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => goTo(state.active - 1)}
                    disabled={!state.canPrev}
                    aria-label={labels.previous}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => goTo(state.active + 1)}
                    disabled={!state.canNext}
                    aria-label={labels.next}
                >
                    <ChevronRight />
                </Button>
            </div>

            <div
                ref={trackRef}
                tabIndex={0}
                className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-1 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-primary/50 [&::-webkit-scrollbar]:hidden"
            >
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={labels.slides[i]}
                        className="grid shrink-0 basis-[85%] snap-start md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
                    >
                        {slide}
                    </div>
                ))}
            </div>

            <div className={`mt-6 flex items-center justify-center ${controlsClass}`}>
                {Array.from({ length: state.pages }).map((_, i) => (
                    // The button is a 24px touch target (WCAG 2.5.8); the inner span is the visible dot.
                    <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={labels.slides[i]}
                        aria-current={i === state.active ? "true" : undefined}
                        className="group flex h-6 min-w-6 cursor-pointer items-center justify-center"
                    >
                        <span
                            className={`block h-1.5 rounded-full transition-all duration-200 ${
                                i === state.active
                                    ? "w-6 bg-primary"
                                    : "w-1.5 bg-border group-hover:bg-muted-foreground"
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
