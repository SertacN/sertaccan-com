"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import Github from "../icons/github";
import Linkedin from "../icons/linkedin";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="flex justify-between border-t border-border py-8">
            <p className="font-mono text-xs text-muted-foreground">© 2026 Sertaç Can</p>
            <div className="flex items-center gap-4">
                <Link
                    href={"https://github.com/SertacN"}
                    target="_blank"
                    className="text-muted-foreground transition-colors hover:text-primary"
                >
                    <Github size={16} />
                </Link>
                <Link
                    href={"mailto:contact@sertaccan.com"}
                    className="text-muted-foreground transition-colors hover:text-primary"
                >
                    <Mail size={16} />
                </Link>
                <Link
                    href={"https://www.linkedin.com/in/sertacn/"}
                    target="_blank"
                    className="text-muted-foreground transition-colors hover:text-primary"
                >
                    <Linkedin size={16} />
                </Link>
            </div>
            <p className="font-mono text-xs text-muted-foreground">{t("footer.develop_tech")}</p>
        </footer>
    );
}
