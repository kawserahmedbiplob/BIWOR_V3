"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type HeaderProps = {
  companyName?: string;
  logo?: string;
};

export default function Header({ companyName = "BIWORSOURCING", logo }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#products", label: "Products" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-[4.25rem]">
        <Link href="/" className="flex items-center gap-2.5 group">
          {logo ? (
            <Image
              src={logo}
              alt={companyName}
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              unoptimized
            />
          ) : (
            <span className="font-bold text-xl tracking-tight text-teal-900 group-hover:text-teal-700 transition">
              BIWOR<span className="text-amber-500">SOURCING</span>
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-slate-600 hover:text-teal-800 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-[13px] font-semibold bg-teal-800 text-white px-4 py-2 rounded-lg hover:bg-teal-900 transition shadow-sm"
          >
            Contact Us
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-slate-700 py-2.5 px-2 rounded-lg hover:bg-slate-50"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block text-center text-sm font-semibold bg-teal-800 text-white px-4 py-2.5 rounded-lg mt-2"
          >
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
}
