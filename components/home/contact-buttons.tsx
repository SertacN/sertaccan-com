import { Mail } from "lucide-react";
import Link from "next/link";
import Github from "../icons/github";
import Linkedin from "../icons/linkedin";

export default async function ContactButtons() {
    return (
        <section id="contactButtons" className="px-4">
            <div className="mb-6 flex flex-wrap justify-center gap-4">
                <Link
                    href="mailto:contact@sertaccan.com"
                    className="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors duration-150 hover:border-accent-foreground hover:text-accent-foreground"
                >
                    <Mail size={18} />
                    Email
                </Link>
                <Link
                    href="https://github.com/SertacN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors duration-150 hover:border-accent-foreground hover:text-accent-foreground"
                >
                    <Github size={18} />
                    GitHub
                </Link>
                <a
                    href="https://www.linkedin.com/in/sertacn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors duration-150 hover:border-accent-foreground hover:text-accent-foreground"
                >
                    <Linkedin size={18} />
                    LinkedIn
                </a>
            </div>
        </section>
    );
}
