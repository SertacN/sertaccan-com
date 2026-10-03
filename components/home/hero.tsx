"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CampfireScene from "@/components/home/campfire-scene";
import { MailIcon } from "@/components/pixel/icons";
import Github from "../icons/github";
import { bigButton } from "@/components/pixel/styles";

const TYPE_DELAY_MS = 400;
const TYPE_SPEED_MS = 80;
const CURSOR_BLINK_MS = 530;

const heroButton = `${bigButton} tall:h-16 tall:gap-3.5 tall:px-6 tall:text-xl tall:[&_svg]:size-6`;

export default function Hero() {
    const t = useTranslations("hero");
    const role = t("role");
    const textRef = useRef<HTMLDivElement>(null);
    const [typed, setTyped] = useState(0);
    const [cursorOn, setCursorOn] = useState(true);
    const [instant, setInstant] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const id = setTimeout(() => setInstant(true), 0);
            return () => clearTimeout(id);
        }
        let typeTimer: ReturnType<typeof setInterval> | undefined;
        const start = setTimeout(() => {
            typeTimer = setInterval(() => {
                setTyped((n) => {
                    if (n >= role.length) clearInterval(typeTimer);
                    return Math.min(n + 1, role.length);
                });
            }, TYPE_SPEED_MS);
        }, TYPE_DELAY_MS);
        const blink = setInterval(() => setCursorOn((v) => !v), CURSOR_BLINK_MS);
        return () => {
            clearTimeout(start);
            clearInterval(typeTimer);
            clearInterval(blink);
        };
    }, [role]);

    const shown = instant ? role.length : typed;

    return (
        <section
            id="hero"
            className="relative left-1/2 -mt-16 h-[max(660px,100svh)] w-screen -translate-x-1/2 overflow-hidden bg-sky-top md:h-[max(700px,100svh)]"
        >
            <CampfireScene textRef={textRef} />

            <div className="absolute inset-x-0 top-0 px-6 pt-32 md:pt-37.5 tall:pt-56">
                <div className="mx-auto flex max-w-site justify-start">
                    <div ref={textRef} className="flex flex-col items-start text-left">
                        <h1
                            className="m-0 font-pixel text-[76px] leading-[0.9] tracking-[0.02em] text-name md:text-[132px] tall:text-[198px]"
                            style={{ textShadow: "4px 4px 0 var(--name-shadow)" }}
                        >
                            Sertaç Can
                        </h1>

                        {/* The terminal keeps its dark look in both themes. */}
                        <div className="frame-4 relative mx-1 mt-7 grid bg-[#0a0a0a] px-4.5 py-2.5 text-left font-mono text-base leading-[1.3] font-bold text-[#00ff88] md:text-xl tall:mt-10 tall:px-7 tall:py-4 tall:text-[30px]">
                            <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre">
                                &gt; {role}_
                            </span>
                            <span aria-hidden="true" className="col-start-1 row-start-1 whitespace-pre">
                                &gt; {role.slice(0, shown)}
                                <span style={{ opacity: instant || cursorOn ? 1 : 0 }}>_</span>
                            </span>
                            <span className="sr-only">{role}</span>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-5 px-1 tall:mt-12 tall:gap-7">
                            <a
                                href="https://github.com/SertacN"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={heroButton}
                            >
                                <Github size={16} />
                                <span>GitHub</span>
                            </a>
                            <a href="#contact" className={heroButton}>
                                <MailIcon />
                                <span>{t("mail")}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
