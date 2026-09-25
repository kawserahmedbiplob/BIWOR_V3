"use client";

import { useEffect, useRef } from "react";

export type CertItem = {
  id: string;
  name: string;
  purpose?: string;
  logo: string;
  logoHeight: number;
  visible?: boolean;
};

type Props = {
  items: CertItem[];
  speed?: number; // seconds for one full loop
  grayscale?: boolean;
};

export default function CertLogoSlider({ items, speed = 30, grayscale = true }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const visible = items.filter((i) => i.visible !== false && (i.logo || i.name));

  useEffect(() => {
    const el = trackRef.current;
    if (!el || visible.length === 0) return;
    let raf = 0;
    let pos = 0;
    const pxPerSec = el.scrollWidth / 2 / speed;

    const tick = (t: number) => {
      if (!el) return;
      pos += pxPerSec / 60;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible.length, speed]);

  if (visible.length === 0) {
    return (
      <p className="text-center text-sm text-slate-400 py-8">
        Add certification logos in Admin → Certifications
      </p>
    );
  }

  // Duplicate for seamless loop
  const loop = [...visible, ...visible];

  return (
    <div className="relative overflow-hidden py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />
      <div
        ref={trackRef}
        className="flex items-center gap-10 w-max will-change-transform"
        style={{ animation: "none" }}
      >
        {loop.map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className="flex flex-col items-center justify-center shrink-0 min-w-[120px] px-4"
            title={c.purpose || c.name}
          >
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                alt={c.name}
                style={{ height: c.logoHeight || 48, width: "auto", maxWidth: 160 }}
                className={`object-contain ${grayscale ? "grayscale opacity-70 hover:grayscale-0 hover:opacity-100" : ""} transition duration-300`}
              />
            ) : (
              <div
                className="flex items-center justify-center px-4 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-sm"
                style={{ height: c.logoHeight || 48 }}
              >
                {c.name}
              </div>
            )}
            <span className="mt-2 text-[10px] text-slate-400 uppercase tracking-wide">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
