import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import RealSky from "@/components/background/RealSky";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html lang="es" className={`${jakartaSans.variable} ${plexMono.variable}`}>
      <body>
        <RealSky />
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
