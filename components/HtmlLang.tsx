"use client";

import { useEffect } from "react";

/** Ajusta el atributo lang del documento en la versión en inglés (el layout raíz es en español). */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
