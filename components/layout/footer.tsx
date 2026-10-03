import Link from "next/link";
import Github from "../icons/github";
import Linkedin from "../icons/linkedin";
import { getTranslations } from "next-intl/server";
import { MailIcon } from "@/components/pixel/icons";
import EmbersStrip from "./embers-strip";

const iconLink = "flex size-8 items-center justify-center text-foot-fg transition-colors hover:text-foot-hi";

export default async function Footer() {
    const t = await getTranslations("footer");
    return (
        <footer className="mt-12">
            <EmbersStrip />
            <div className="bg-foot-bg px-6 pt-7 pb-9">
                <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-4">
                    <p className="font-mono text-[13px] text-foot-fg">© 2026 Sertaç Can</p>
                    <div className="flex gap-2">
                        <Link
                            href="https://github.com/SertacN"
                            target="_blank"
                            aria-label="GitHub"
                            className={iconLink}
                        >
                            <Github size={16} />
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/sertacn/"
                            target="_blank"
                            aria-label="LinkedIn"
                            className={iconLink}
                        >
                            <Linkedin size={16} />
                        </Link>
                        <Link href="mailto:contact@sertaccan.com" aria-label="Email" className={iconLink}>
                            <MailIcon />
                        </Link>
                    </div>
                    <p className="font-mono text-[13px] text-foot-fg">{t("develop_tech")}</p>
                </div>
            </div>
        </footer>
    );
}
