"use client";

import { useSyncExternalStore } from "react";

/*
 * Tema de la bitácora (claro u oscuro). El cielo siempre es nocturno. La elección se guarda en el
 * navegador y un script en <head> la aplica antes de pintar, para que no parpadee.
 */

type Theme = "light" | "dark";
const EVENT = "themechange";

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

export default function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === "dark" ? toLight : toDark}
      title={theme === "dark" ? toLight : toDark}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          // Sin almacenamiento: el tema dura solo esta visita.
        }
        window.dispatchEvent(new Event(EVENT));
      }}
    >
      <span aria-hidden>{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
