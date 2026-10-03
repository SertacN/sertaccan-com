"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/pixel/icons";
import SectionHeading from "@/components/pixel/section-heading";

type SliderLabels = {
    region: string;
    previous: string;
    next: string;
    // One label per slide, e.g. "2 / 5"; also used for the dot buttons.
    slides: string[];
};

// Controls are hidden by breakpoint (not by measuring) so the layout does not shift on hydration.
// Visible slides per breakpoint: 1 on mobile, 2 from sm, 3 from lg.
function dotsVisibilityClass(count: number) {
    if (count <= 1) return "hidden";
    if (count <= 2) return "sm:hidden";
    if (count <= 3) return "lg:hidden";
    return "";
}

const arrowButton =
    "frame-2 m-0.5 flex size-11 cursor-pointer items-center justify-center border-0 bg-card text-foreground hover:bg-btn-hover disabled:cursor-default disabled:bg-background disabled:text-muted-foreground disabled:[--frame:var(--pixel-line)] disabled:hover:bg-background";

export default function ProjectSlider({
    heading,
    children,
    labels,
}: {
    heading: string;
    children: React.ReactNode;
    labels: SliderLabels;
}) {
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

    return (
        <div role="region" aria-roledescription="carousel" aria-label={labels.region} className="flex flex-col gap-7">
            <div className="flex flex-wrap items-end justify-between gap-5">
                <SectionHeading>{heading}</SectionHeading>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className={arrowButton}
                        onClick={() => goTo(state.active - 1)}
                        disabled={!state.canPrev}
                        aria-label={labels.previous}
                    >
                        <ArrowLeftIcon />
                    </button>
                    <button
                        type="button"
                        className={arrowButton}
                        onClick={() => goTo(state.active + 1)}
                        disabled={!state.canNext}
                        aria-label={labels.next}
                    >
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>

            <div
                ref={trackRef}
                tabIndex={0}
                className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pt-1 pb-2 outline-none [scrollbar-width:none] focus-visible:shadow-[0_0_0_4px_var(--primary)] [&::-webkit-scrollbar]:hidden"
            >
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={labels.slides[i]}
                        className="grid shrink-0 basis-[calc(100%-56px)] snap-start sm:basis-[calc((100%-32px)/2+8px)] lg:basis-[calc((100%-56px)/3+8px)]"
                    >
                        {slide}
                    </div>
                ))}
            </div>

            <div className={`flex justify-center gap-1 ${dotsVisibilityClass(slides.length)}`}>
                {Array.from({ length: state.pages }).map((_, i) => (
                    // 24px touch target (WCAG 2.5.8); the inner span is the visible pip.
                    <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={labels.slides[i]}
                        aria-current={i === state.active ? "true" : undefined}
                        className="flex size-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                    >
                        <span
                            className={`h-2 ${
                                i === state.active
                                    ? "w-5 bg-primary shadow-[inset_0_0_0_2px_var(--primary)]"
                                    : "w-2 shadow-[inset_0_0_0_2px_var(--muted-foreground)]"
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
