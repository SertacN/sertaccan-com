"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Sparkles } from "@/components/home/sparkles";
import Github from "../icons/github";

export default function Hero() {
    const t = useTranslations("hero");
    const [typedText, setTypedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const fullText = t("role");
        let i = 0;

        const typeInterval = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 80);

        const cursorInterval = setInterval(() => {
            setShowCursor((v) => !v);
        }, 530);

        return () => {
            clearInterval(typeInterval);
            clearInterval(cursorInterval);
        };
    }, [t]);

    return (
        <section
            id="hero"
            className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center"
        >
            {/* Animated gradient background */}
            <div className="hero-gradient pointer-events-none absolute inset-0" />

            <h1 className="relative z-10 font-mono text-4xl font-bold tracking-tight md:text-7xl">Sertaç Can</h1>

            <div className="relative mt-4">
                <p className="relative z-10 font-mono text-lg text-primary md:text-2xl">
                    <span className="inline-block">
                        &gt; {typedText}
                        <span className="transition-opacity duration-100" style={{ opacity: showCursor ? 1 : 0 }}>
                            _
                        </span>
                    </span>
                </p>
                <div className="absolute -inset-x-12 -inset-y-6 z-0 md:-inset-x-20 md:-inset-y-8">
                    <Sparkles particleColor="#00ff88" particleDensity={100} minSize={0.6} maxSize={2} speed={0.4} />
                </div>
            </div>

            <div className="relative z-10 mt-8 flex gap-5">
                <a
                    href="https://github.com/SertacN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors duration-150 hover:text-primary"
                    aria-label="GitHub"
                >
                    <Github size={24} />
                </a>
                <a
                    href="mailto:contact@sertaccan.com"
                    className="text-muted-foreground transition-colors duration-150 hover:text-primary"
                    aria-label="Email"
                >
                    <Mail size={24} />
                </a>
            </div>
        </section>
    );
}
