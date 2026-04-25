import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/components/providers/i18n-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" value={{ dark: "dark", light: "light" }} defaultTheme="dark" enableSystem>
            <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
    );
}
