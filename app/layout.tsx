import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://valderramam.vercel.app"),
  title: "Maximiliano Valderrama | Astronomía y desarrollo Python",
  description:
    "Portafolio de Maximiliano Valderrama: astronomía, desarrollo backend en Python y data science. Un cielo real con datos de Mellinger, DSS2, 2MASS y GALEX donde cada objeto es un proyecto.",
  openGraph: {
    title: "Maximiliano Valderrama | Astronomía y desarrollo Python",
    description: "Un cielo real con zoom y filtros ultravioleta, visible e infrarrojo; cada objeto es un proyecto.",
    locale: "es_CL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body data-band="vis">{children}</body>
    </html>
  );
}
