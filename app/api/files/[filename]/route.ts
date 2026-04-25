import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params;

    if (filename.includes("..") || filename.includes("/")) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const filePath = join(process.cwd(), "uploads", filename);
        const buffer = await readFile(filePath);
        const ext = filename.split(".").pop()?.toLowerCase() ?? "";
        const contentType: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp",
            gif: "image/gif",
        };
        return new NextResponse(buffer, {
            headers: { "Content-Type": contentType[ext] ?? "application/octet-stream" },
        });
    } catch {
        return new NextResponse("Not Found", { status: 404 });
    }
}
