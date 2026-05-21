import { Mail } from "lucide-react";
import Link from "next/link";
import Github from "../icons/github";
import Linkedin from "../icons/linkedin";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
    const t = await getTranslations("footer");
    return (
        <footer className="flex justify-between border-t border-border py-8">
            <p className="font-mono text-xs text-muted-foreground">© 2026 Sertaç Can</p>
            <div className="flex items-center gap-4">
                <Link
                    href={"https://github.com/SertacN"}
                    target="_blank"
                    aria-label="Github Link"
                    className="text-muted-foreground transition-colors hover:text-primary"
                >
                    <Github size={16} />
                </Link>
                <Link
                    href={"mailto:contact@sertaccan.com"}
                    aria-label="Mail"
                    className="text-muted-foreground transition-colors hover:text-primary"
                >
                    <Mail size={16} />
                </Link>
                <Link
                    href={"https://www.linkedin.com/in/sertacn/"}
                    target="_blank"
                    aria-label="Linkedin Link"
                    className="text-muted-foreground transition-colors hover:text-primary"
                >
                    <Linkedin size={16} />
                </Link>
            </div>
            <p className="font-mono text-xs text-muted-foreground">{t("develop_tech")}</p>
        </footer>
    );
}
