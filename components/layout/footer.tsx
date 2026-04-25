"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import Github from "../icons/github";
import Linkedin from "../icons/linkedin";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="flex justify-between">
            <p className="font-mono text-xs">© 2026 Sertaç Can</p>
            <div className="flex items-center gap-2">
                <Link href={"https://github.com/SertacN"} target="_blank">
                    <Github size={16} />
                </Link>
                <Link href={"mailto:contact@sertaccan.com"}>
                    <Mail size={16} />
                </Link>
                <Link href={"https://www.linkedin.com/in/sertacn/"} target="_blank">
                    <Linkedin size={16} />
                </Link>
            </div>
            <p className="font-mono text-xs">{t("footer.develop_tech")}</p>
        </footer>
    );
}
