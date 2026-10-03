"use client";

import { useEffect, useRef, useState } from "react";
import PixelSprite from "@/components/pixel/pixel-sprite";
import { CP, PORTRAIT } from "@/components/pixel/painter";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, EndIcon } from "@/components/pixel/icons";

type DialogLabels = {
    speaker: string;
    next: string;
    previous: string;
    showAll: string;
    showDialog: string;
    advance: string;
    // One label per page, e.g. "2 / 5".
    pages: string[];
};

const TYPE_TICK_MS = 40;
const CHARS_PER_TICK = 2;

const stepButton =
    "frame-2 m-0.5 flex h-9 cursor-pointer items-center gap-2 border-0 bg-card px-3 font-mono text-[13px] font-bold text-foreground hover:bg-btn-hover disabled:cursor-default disabled:bg-background disabled:text-muted-foreground disabled:[--frame:var(--pixel-line)] disabled:hover:bg-background";
const linkButton =
    "h-9 cursor-pointer border-0 bg-transparent px-3 font-mono text-[13px] font-bold text-primary underline underline-offset-4";

export default function AboutDialog({ paragraphs, labels }: { paragraphs: string[]; labels: DialogLabels }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(0);
    const [chars, setChars] = useState(0);
    const [started, setStarted] = useState(false);
    // With reduced motion every line appears at once instead of being typed.
    const [instant, setInstant] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const text = paragraphs[page] ?? "";
    const shown = !started ? 0 : instant ? text.length : Math.min(chars, text.length);
    const done = shown >= text.length;
    const isLast = page === paragraphs.length - 1;

    // Start typing only once the dialog scrolls into view.
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInstant(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
                    setStarted(true);
                    io.disconnect();
                }
            },
            { threshold: 0.25 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!started || done || showAll) return;
        const id = setTimeout(() => setChars((n) => n + CHARS_PER_TICK), TYPE_TICK_MS);
        return () => clearTimeout(id);
    }, [started, done, showAll, chars]);

    const goTo = (next: number, fullyTyped = false) => {
        const target = Math.max(0, Math.min(paragraphs.length - 1, next));
        setPage(target);
        setChars(fullyTyped ? paragraphs[target].length : 0);
    };

    // Clicking the box first finishes the current line, then advances.
    const advance = () => {
        setStarted(true);
        if (!done) setChars(text.length);
        else if (!isLast) goTo(page + 1);
    };

    if (showAll) {
        return (
            <div ref={rootRef} className="flex w-full max-w-[72ch] flex-col gap-4">
                {paragraphs.map((p, i) => (
                    <p key={i} className="m-0 text-[17px] leading-relaxed text-pretty text-foreground">
                        {p}
                    </p>
                ))}
                <button
                    type="button"
                    className={`${linkButton} mt-2 self-start px-0`}
                    onClick={() => setShowAll(false)}
                >
                    {labels.showDialog}
                </button>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="flex w-full max-w-230 flex-col gap-5">
            <div className="frame-dialog m-2 flex flex-wrap items-start gap-6 bg-card p-6">
                <div className="flex flex-none flex-col items-center gap-3">
                    <div className="frame-4 m-1 flex size-20 items-center justify-center bg-portrait-bg">
                        {/* The portrait palette follows the scene: warmer, firelit tones at night. */}
                        <PixelSprite sprite={{ rows: PORTRAIT, palette: CP.night }} className="size-16 light:hidden" />
                        <PixelSprite
                            sprite={{ rows: PORTRAIT, palette: CP.day }}
                            className="hidden size-16 light:block"
                        />
                    </div>
                    <span className="frame-2 m-0.5 bg-background px-2.5 py-0.5 font-mono text-[13px] font-bold text-primary">
                        {labels.speaker}
                    </span>
                </div>

                <div
                    role="button"
                    tabIndex={0}
                    aria-label={labels.advance}
                    onClick={advance}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            advance();
                        }
                    }}
                    className="grid min-w-0 flex-[1_1_300px] cursor-pointer text-[17px] leading-relaxed text-foreground outline-none focus-visible:shadow-[0_0_0_4px_var(--primary)]"
                >
                    {/* Every line is laid out invisibly in the same cell, so the box keeps the height of the
                        longest one and does not jump between pages or while typing. */}
                    {paragraphs.map((p, i) => (
                        <p key={i} aria-hidden="true" className="invisible col-start-1 row-start-1 m-0 pr-7">
                            {p}
                        </p>
                    ))}
                    <p aria-hidden="true" className="col-start-1 row-start-1 m-0 pr-7 text-pretty">
                        {text.slice(0, shown)}
                    </p>
                    <div aria-hidden="true" className="col-start-1 row-start-1 self-end justify-self-end text-primary">
                        {done && !isLast && <ArrowDownIcon className="pixel-bounce" />}
                        {done && isLast && <EndIcon />}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 px-1.5">
                <button type="button" className={stepButton} onClick={() => goTo(page - 1, true)} disabled={page === 0}>
                    <ArrowLeftIcon />
                    <span>{labels.previous}</span>
                </button>
                <span aria-live="polite" className="min-w-14 text-center font-mono text-sm font-bold text-foreground">
                    {labels.pages[page]}
                </span>
                <button type="button" className={stepButton} onClick={() => goTo(page + 1)} disabled={isLast}>
                    <span>{labels.next}</span>
                    <ArrowRightIcon />
                </button>
                <button type="button" className={`${linkButton} ml-auto`} onClick={() => setShowAll(true)}>
                    {labels.showAll}
                </button>
            </div>

            {/* Full text for screen readers and crawlers; the typed copy above is visual only. */}
            <div className="sr-only">
                {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                ))}
            </div>
        </div>
    );
}
