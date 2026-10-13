"use client";

import { useRef, useState } from "react";
import { UI, type Locale } from "@/data/ui";

export default function CopyEmail({ email, locale }: { email: string; locale: Locale }) {
  const U = UI[locale].contact;
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin acceso al portapapeles: se selecciona el texto para copiarlo a mano.
      const sel = window.getSelection();
      if (ref.current && sel) {
        const r = document.createRange();
        r.selectNodeContents(ref.current);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    }
  };

  return (
    <>
      <div className="mail" ref={ref}>
        {email}
      </div>
      <div className="btns">
        <button className="btn fill" type="button" onClick={copy}>
          {copied ? U.copied : U.copy}
        </button>
        <a className="btn" href={`mailto:${email}`}>
          {U.write}
        </a>
      </div>
    </>
  );
}
