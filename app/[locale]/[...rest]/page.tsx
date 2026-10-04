import { notFound } from "next/navigation";

// Unmatched paths would otherwise fall through to the root not-found page, outside the locale layout.
export default function CatchAll() {
    notFound();
}
