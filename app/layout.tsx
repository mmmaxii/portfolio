import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import GalaxyBackground from "@/components/background/GalaxyBackground";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portafolio-mmmaxii.vercel.app"),
  title: "Maximiliano Valderrama | Astronomía & Desarrollo Python",
  description:
    "Portafolio de Maximiliano Valderrama — Licenciado en Astronomía y Desarrollador FullStack Python. Simulaciones astrofísicas, machine learning y desarrollo backend.",
  openGraph: {
    title: "Maximiliano Valderrama | Astronomía & Desarrollo Python",
    description:
      "Un mapa estelar interactivo: simulaciones de discos protoplanetarios, proyectos fullstack y astrofísica computacional.",
    locale: "es_CL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${inter.variable}`}>
      <body>
        <GalaxyBackground />
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
