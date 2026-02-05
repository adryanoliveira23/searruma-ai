import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SeArrumaAI | Transforme seu visual com IA",
  description:
    "Crie fotos profissionais de aniversário e estúdio em segundos usando inteligência artificial.",
  keywords: [
    "IA",
    "edição de fotos",
    "SaaS",
    "aniversário",
    "fotografia profissional",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
