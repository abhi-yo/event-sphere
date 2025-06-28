import { Inter, Bricolage_Grotesque } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Providers } from "./providers";
import { StructuredData } from "./structured-data";
import { metadata, viewport } from "./metadata";
import "./globals.css";

export { metadata, viewport };

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bricolage",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolageGrotesque.variable}`}
    >
      <body className={inter.className}>
        <StructuredData />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
