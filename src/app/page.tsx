import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, getSettings, getGallery, getCertifications } from "@/lib/data";
import CertLogoSlider from "@/components/CertLogoSlider";
import MeetingScheduler from "@/components/MeetingScheduler";
import Image from "next/image";

export default function Home() {
  const products = getProducts();
  const gallery = getGallery();
  const s = getSettings();

  const leadTimes = [
    { cat: "Basic Knitwear / T-Shirts", sample: "10–14 days", bulk: "45–55 days" },
    { cat: "Woven Shirts & Blouses", sample: "14–18 days", bulk: "50–60 days" },
    { cat: "Denim", sample: "14–20 days", bulk: "55–65 days" },
    { cat: "Outerwear & Jackets", sample: "18–25 days", bulk: "60–75 days" },
    { cat: "Activewear / Sportswear", sample: "14–18 days", bulk: "50–60 days" },
    { cat: "Sweaters", sample: "18–25 days", bulk: "60–70 days" },
  ];

  const certifications = getCertifications();

  return (
    <>
      <Header companyName={s.companyName} logo={s.logo || undefined} />
      <main>
        {/* HERO */}
        <section className="relative bg-slate-950 text-white overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
          {/* Background image layer */}
          {s.heroBackgroundImage ? (
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.heroBackgroundImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Color blend overlay — uses rgba so blending works correctly */}
              <div
                className="absolute inset-0 z-[1]"
                style={{
                  backgroundColor: (() => {
                    const hex = (s.heroOverlayColor || "#0f172a").replace("#", "");
                    const full = hex.length === 3 ? hex.split("").map((ch: string) => ch + ch).join("") : hex;
                    const r = parseInt(full.substring(0, 2), 16) || 15;
                    const g = parseInt(full.substring(2, 4), 16) || 23;
                    const b = parseInt(full.substring(4, 6), 16) || 42;
                    const a = Math.min(100, Math.max(0, Number(s.heroOverlayOpacity) || 60)) / 100;
                    return `rgba(${r}, ${g}, ${b}, ${a})`;
                  })(),
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_-20%,rgba(15,118,110,0.35),transparent)]" />
          )}
          {/* Content above image + overlay */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-28 md:pb-32 relative z-10 w-full">
            <p className="text-amber-400/90 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
              {s.heroBadge}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] max-w-3xl tracking-tight">
              {s.heroTitle}
              {s.heroHighlight && (
                <span className="block text-amber-400 mt-1 italic font-serif font-normal text-3xl sm:text-4xl md:text-5xl">
                  {s.heroHighlight}
                </span>
              )}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
              {s.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["Trusted factories", s.moqNote, "Full quality check"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-sm text-slate-200">
                  <span className="text-teal-400">✓</span> {t}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition text-sm shadow-lg shadow-amber-500/25">
                Contact Us
              </a>
              <a href="#services" className="border border-white/20 hover:bg-white/5 font-medium px-6 py-3 rounded-lg transition text-sm">
                Our Services
              </a>
            </div>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm border-t border-white/10 pt-10">
              <div>
                <div className="text-teal-400 font-semibold mb-1">◆ {s.registeredNote}</div>
              </div>
              <div>
                <div className="text-teal-400 font-semibold mb-1">◆ {s.complianceNote}</div>
              </div>
              <div>
                <div className="text-teal-400 font-semibold mb-1">◆ {s.leadTimeNote}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">About</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight max-w-2xl">
              {s.aboutTitle}
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl">
              {s.aboutText}
            </p>
            <div className="mt-6 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Headquarters</span>
              <br />{s.address}
            </div>
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {[
                { n: "01", t: "Factory Sourcing", d: "Direct access to vetted, certified factories" },
                { n: "02", t: "Compliance First", d: "ACCORD, BSCI, SEDEX, WRAP, GOTS certified partners" },
                { n: "03", t: "Quality Control", d: "Inline, mid-line, and final inspection" },
                { n: "04", t: "End-to-End Service", d: "From sampling to final shipment delivery" },
                { n: "05", t: "Full Documentation", d: "LC handling, export docs & logistics" },
              ].map((i) => (
                <div key={i.n} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-teal-200 hover:bg-white transition">
                  <div className="text-teal-600 font-bold text-xs mb-2">{i.n}</div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{i.t}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{i.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BANGLADESH — "The label tells the real story" */}
        {s.bangladeshText && (
          <section className="py-16 md:py-20 bg-slate-900 text-white">
            {(() => {
              const enabled = !!(s as any).bangladeshImagesEnabled;
              const count = Math.min(3, Math.max(1, Number((s as any).bangladeshImageCount) || 1));
              const imgs = [1, 2, 3].slice(0, count).map((n) => ({
                src: (s as any)[`bangladeshImage${n}`] as string,
                alt: ((s as any)[`bangladeshImage${n}Alt`] as string) || "Bangladesh sourcing",
                height: Number((s as any)[`bangladeshImage${n}Height`]) || 280,
              })).filter((i) => i.src);
              const showImages = enabled && imgs.length > 0;

              // No images → same centered layout as before
              if (!showImages) {
                return (
                  <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-teal-400 font-semibold text-xs tracking-[0.15em] uppercase mb-4">Bangladesh Sourcing</p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                      The label tells the <em className="text-amber-400 not-italic font-serif">real story.</em>
                    </h2>
                    <p className="text-slate-300 leading-relaxed">{s.bangladeshText}</p>
                  </div>
                );
              }

              // With images → redesigned layout
              return (
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                  <div className="text-center max-w-3xl mx-auto mb-10">
                    <p className="text-teal-400 font-semibold text-xs tracking-[0.15em] uppercase mb-4">Bangladesh Sourcing</p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                      The label tells the <em className="text-amber-400 not-italic font-serif">real story.</em>
                    </h2>
                    <p className="text-slate-300 leading-relaxed">{s.bangladeshText}</p>
                  </div>
                  <div
                    className={`grid gap-4 ${
                      imgs.length === 1
                        ? "max-w-2xl mx-auto grid-cols-1"
                        : imgs.length === 2
                        ? "sm:grid-cols-2 max-w-4xl mx-auto"
                        : "sm:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {imgs.map((img, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800"
                        style={{ minHeight: Math.min(img.height, 400) }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full object-cover"
                          style={{ height: img.height, maxHeight: 480 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* PRINCIPLES */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3 text-center">Our Principles</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">The standards <em className="font-serif text-teal-800">we live by</em>.</h2>
            <p className="text-center text-slate-500 text-sm mb-12">Four operating rules. Not slogans.</p>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { n: "01", t: "Transparency First", d: "Open cost breakdowns at every quote. Buyer-side fee only — nothing taken from the factory. No hidden markups." },
                { n: "02", t: "Compliance Without Compromise", d: "Every factory BSCI or SEDEX certified minimum. Audits managed end-to-end — zero paperwork on your team." },
                { n: "03", t: "Independent Quality Control", d: "QC team employed by BIWORSOURCING — fully independent of factories. AQL 2.5 enforced." },
                { n: "04", t: "Your IP, Protected", d: "Mutual NDAs before any brief. Designs never disclosed without written consent." },
              ].map((p) => (
                <div key={p.n} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-teal-600 font-bold text-sm shrink-0">— {p.n}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{p.t}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight max-w-2xl mb-12">
              A full-service apparel sourcing agent <em className="font-serif text-teal-800">in Bangladesh.</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { n: "01", t: "Factory Matching & Sourcing", d: "We match your product to the right factory from our vetted panel — knit, woven, denim, sweater, outerwear, towels." },
                { n: "02", t: "Private Label & Product Development", d: "Tech pack in, approved sample out. Private label, white label, and full cut-and-sew programmes. MOQs from 500 units per style." },
                { n: "03", t: "Quality Control & Inspection", d: "In-house QC team, independent of the factory. Inline, mid-line, and final AQL 2.5 inspections. Issues fixed before goods leave the floor." },
                { n: "04", t: "Compliance Management", d: "WRAP, BSCI, SEDEX, GOTS, OEKO-TEX, Accord/RSC, ISO 9001 factories. Modern Slavery Act, REACH, and CPSIA documentation included." },
                { n: "05", t: "Shipping & Documentation", d: "LC handling, BL, certificate of origin, customs paperwork. FOB, CNF, or DDP to your port." },
                { n: "06", t: "After-Shipment Support", d: "Claims, shortage resolution, reorder coordination, and account management for repeat programmes." },
              ].map((svc) => (
                <div key={svc.n} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white transition">
                  <div className="text-teal-600 font-bold text-xs mb-3">— {svc.n}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{svc.t}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{svc.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="py-20 md:py-28 bg-slate-950 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-amber-400/90 font-semibold text-xs tracking-[0.15em] uppercase mb-3">Concept to Delivery</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Five stages, <em className="font-serif text-amber-400">one accountable team</em>.
            </h2>
            <p className="text-slate-400 mb-14 max-w-xl">How an order moves from brief to shipment. One point of contact, end to end.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { n: "01", icon: "✎", t: "Design & Brief", d: "Tech pack reviewed, mood board interpreted, factory matched." },
                { n: "02", icon: "✂", t: "Sampling", d: "Proto, fit, and PP samples developed against your specs." },
                { n: "03", icon: "⚙", t: "Production", d: "Bulk production with inline QC at every stage of the floor." },
                { n: "04", icon: "✓", t: "Inspection", d: "AQL 2.5 audit, packing verification, documentation." },
                { n: "05", icon: "⛵", t: "Delivery", d: "Freight booked, customs cleared, tracking shared instantly." },
              ].map((st) => (
                <div key={st.n}>
                  <div className="text-2xl mb-3 opacity-80">{st.icon}</div>
                  <div className="text-amber-400/70 font-bold text-sm mb-1">Stage {st.n}</div>
                  <h3 className="font-semibold text-lg mb-2">{st.t}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{st.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO WE WORK WITH */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3 text-center">Who We Work With</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-3">
              Built for brands at <em className="font-serif text-teal-800">every stage</em>.
            </h2>
            <p className="text-center text-slate-500 text-sm mb-12 max-w-lg mx-auto">
              From 500-unit Shopify launches to six-figure repeat programmes. Service adjusts, standards don&apos;t.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { n: "01", t: "DTC & E-Commerce Brands", d: "Low MOQ private label from 500 units. Built for Shopify, Amazon, and DTC launches." },
                { n: "02", t: "Startups & Boutiques", d: "Tech pack development, fabric matching, cut and sew. Your branding, our factory network." },
                { n: "03", t: "Established Retailers", d: "High-volume wholesale across knit, denim, t-shirts, hoodies, activewear. SEDEX and ISO 9001 factories." },
                { n: "04", t: "Sustainable & Ethical Labels", d: "GOTS organic cotton, OEKO-TEX, fair trade, and recycled-fabric mills. Full traceability on request." },
                { n: "05", t: "Uniform & Promotional Programmes", d: "School, corporate, hospitality, hi-vis workwear, and promotional apparel. Blank t-shirts and polos for distributors." },
                { n: "06", t: "Sportswear & Activewear Labels", d: "Moisture-wicking fabrics, sublimation printing, stretch knits. Specialist activewear factories." },
              ].map((w) => (
                <div key={w.n} className="p-5 rounded-xl border border-slate-200 hover:border-teal-200 transition">
                  <div className="text-teal-600 font-bold text-xs mb-2">— {w.n}</div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{w.t}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{w.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEAD TIMES */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3 text-center">Lead Times</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
              Indicative timing <em className="font-serif text-teal-800">by category</em>.
            </h2>
            <p className="text-center text-slate-500 text-sm mb-10">Typical timelines from sign-off to shipment. Exact dates confirmed with factory booking.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-xl border border-slate-200 overflow-hidden">
                <thead className="bg-slate-100 text-left">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">Category</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">Sample Lead Time</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">Bulk Lead Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leadTimes.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-5 py-3.5 font-medium text-slate-900">{r.cat}</td>
                      <td className="px-5 py-3.5 text-slate-600">{r.sample}</td>
                      <td className="px-5 py-3.5 text-slate-600">{r.bulk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              What we <em className="font-serif text-teal-800">source.</em>
            </h2>
            <p className="text-slate-600 mb-12 max-w-2xl">
              Knit, woven, denim, sweaters, outerwear, activewear, home textiles — plus swimwear, uniforms, hi-vis, kidswear, loungewear, and blanks.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <div key={p.id} className="group rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-lg transition bg-white">
                  <div className="h-40 bg-gradient-to-br from-slate-100 to-teal-50 relative overflow-hidden">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">👕</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-sm group-hover:text-teal-800 transition">{p.name}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">MOQ {p.moq}</span>
                      <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-medium">{p.leadTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS — logo slider */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3 text-center">Factory Certifications</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
              Standards our <em className="font-serif text-teal-800">partner factories</em> hold.
            </h2>
            <p className="text-center text-slate-500 text-sm mb-10 max-w-xl mx-auto">
              We only place orders with factories carrying recognized certifications. Verifiable on request.
            </p>
            <CertLogoSlider items={certifications} speed={28} grayscale />
          </div>
        </section>

        {/* GALLERY / FACTORIES */}
        {gallery.length > 0 && (
          <section id="factories" className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">Our Factories</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                Inside our <em className="font-serif text-teal-800">production network.</em>
              </h2>
              <p className="text-slate-600 mb-10">Real photographs from certified partner factories.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                    {g.image ? (
                      <Image src={g.image} alt={g.title} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">{g.title}</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="text-white text-sm font-medium">{g.title}</div>
                      <div className="text-white/70 text-xs">{g.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WHY US */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3 text-center">Why Source With Us</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12">
              The BIWORSOURCING <em className="font-serif text-teal-800">advantage.</em>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { n: "01", t: "Registered & Accountable", d: "A fully registered garment buying house in Bangladesh, with proper documentation and legal standing." },
                { n: "02", t: "Compliance-First Approach", d: "We only place orders with WRAP, BSCI, SEDEX and GOTS certified factories — no exceptions." },
                { n: "03", t: "One-Stop Solution", d: "End-to-end service from first sample through to final shipment delivery." },
                { n: "04", t: "Competitive FOB Pricing", d: "Direct factory relationships with zero hidden charges." },
                { n: "05", t: "45-Day Lead Time", d: "Industry-standard 45-day average lead time on most categories with reliable delivery." },
                { n: "06", t: "Transparent Reporting", d: "Regular production and QC updates so you're never in the dark." },
              ].map((a) => (
                <div key={a.n} className="p-5 bg-white rounded-xl border border-slate-200">
                  <div className="text-teal-600 font-bold text-xs mb-2">— {a.n}</div>
                  <h3 className="font-semibold text-slate-900 mb-1">{a.t}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-14">
              <div>
                <p className="text-teal-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">Contact</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                  Let&apos;s discuss your next order
                </h2>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Schedule a virtual or in-person meeting. Bring your tech pack, target price and compliance needs — we&apos;ll prepare factory options.
                </p>
                <div className="space-y-5 text-sm">
                  <div>
                    <div className="font-medium text-slate-900">Headquarters</div>
                    <div className="text-slate-600 mt-0.5">{s.address}</div>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Email</div>
                    <a href={`mailto:${s.email}`} className="text-teal-700 hover:underline">{s.email}</a>
                  </div>
                  {s.phone && (
                    <div>
                      <div className="font-medium text-slate-900">Phone</div>
                      <div className="text-slate-600">{s.phone}</div>
                    </div>
                  )}
                  {s.whatsapp && (
                    <a
                      href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}?text=Hi%20BIWORSOURCING%2C%20I%27d%20like%20to%20discuss%20a%20sourcing%20enquiry.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
                    >
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>
              <MeetingScheduler email={s.email} />
            </div>
          </div>
        </section>
      </main>
      <Footer companyName={s.companyName} footerText={s.footerText} email={s.email} address={s.address} />
    </>
  );
}
