import Link from "next/link";
import Github from "../icons/github";
import Linkedin from "../icons/linkedin";
import { MailIcon } from "@/components/pixel/icons";
import { bigButton } from "@/components/pixel/styles";

export default function ContactButtons() {
    return (
        <div className="flex flex-wrap justify-center gap-4 px-1">
            <a href="mailto:contact@sertaccan.com" className={bigButton}>
                <MailIcon />
                <span>Email</span>
            </a>
            <Link href="https://github.com/SertacN" target="_blank" rel="noopener noreferrer" className={bigButton}>
                <Github size={16} />
                <span>GitHub</span>
            </Link>
            <a
                href="https://www.linkedin.com/in/sertacn"
                target="_blank"
                rel="noopener noreferrer"
                className={bigButton}
            >
                <Linkedin size={16} />
                <span>LinkedIn</span>
            </a>
        </div>
    );
}
