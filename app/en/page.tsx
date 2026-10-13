import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Maximiliano Valderrama | Astronomy and Python development",
  description:
    "Portfolio of Maximiliano Valderrama: astronomy, Python backend development and data science. A real sky with Mellinger, DSS2, 2MASS and GALEX data where every object is a project.",
  alternates: { canonical: "/en", languages: { es: "/", en: "/en" } },
  openGraph: {
    title: "Maximiliano Valderrama | Astronomy and Python development",
    description: "A real sky with zoom and ultraviolet, visible and infrared filters; every object is a project.",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <Home locale="en" />;
}
