import Link from "next/link";

type FooterProps = {
  companyName?: string;
  footerText?: string;
  email?: string;
  address?: string;
};

export default function Footer({
  companyName = "BIWORSOURCING",
  footerText,
  email = "info@biworsourcing.com",
  address = "Dhaka, Bangladesh",
}: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="font-bold text-xl text-white mb-3 tracking-tight">
              BIWOR<span className="text-amber-400">SOURCING</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              {footerText || "A registered apparel buying house in Bangladesh. We source quality garments for global brands with full transparency and compliance."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#services" className="hover:text-white transition">Services</a></li>
              <li><a href="#products" className="hover:text-white transition">Products</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>{address}</li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-white transition">
                  {email}
                </a>
              </li>
              <li className="pt-3">
                <Link href="/admin" className="text-xs text-slate-600 hover:text-slate-400 transition">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
