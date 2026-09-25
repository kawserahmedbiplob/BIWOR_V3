import { getSettings, getProducts } from "@/lib/data";

export default function JsonLd() {
  const s = getSettings() as any;
  const products = getProducts();
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${siteUrl}/#organization`,
    name: s.companyName || "BIWORSOURCING",
    legalName: s.companyName || "BIWORSOURCING",
    url: siteUrl,
    logo: s.logo
      ? s.logo.startsWith("http")
        ? s.logo
        : `${siteUrl}${s.logo}`
      : undefined,
    image: s.ogImage
      ? s.ogImage.startsWith("http")
        ? s.ogImage
        : `${siteUrl}${s.ogImage}`
      : undefined,
    description: s.metaDescription,
    email: s.email,
    telephone: s.phone || undefined,
    foundingDate: "2020",
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address || "Dhaka",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.8103,
      longitude: 90.4125,
    },
    areaServed: [
      { "@type": "Country", name: "Bangladesh" },
      { "@type": "Place", name: "Worldwide" },
    ],
    serviceType: [
      "Apparel Sourcing",
      "Garment Buying House",
      "Private Label Manufacturing",
      "Quality Control",
      "Compliance Management",
    ],
    knowsAbout: [
      "Apparel sourcing Bangladesh",
      "Garment buying house",
      "Knitwear manufacturing",
      "Woven garments",
      "Denim sourcing",
      "BSCI SEDEX WRAP GOTS factories",
    ],
    sameAs: [s.facebookUrl, s.linkedinUrl, s.instagramUrl, s.twitterUrl].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: s.email,
      telephone: s.phone || undefined,
      availableLanguage: ["English", "Bengali"],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: s.companyName || "BIWORSOURCING",
    url: siteUrl,
    description: s.metaDescription,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };

  const services = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Apparel sourcing services",
    itemListElement: [
      "Factory Matching & Sourcing",
      "Private Label & Product Development",
      "Quality Control & Inspection",
      "Compliance Management",
      "Shipping & Documentation",
      "After-Shipment Support",
    ].map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: "Worldwide",
      },
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the minimum order quantity (MOQ) for garments from Bangladesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: s.moqNote
            ? `${s.moqNote}. BIWORSOURCING helps brands source private label and bulk apparel with flexible MOQs through vetted factories in Dhaka.`
            : "Typical MOQs start from around 500 pieces depending on product type. Contact BIWORSOURCING for exact factory options.",
        },
      },
      {
        "@type": "Question",
        name: "How long does apparel production take in Bangladesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: s.leadTimeNote
            ? `${s.leadTimeNote} for many basic programmes. Exact timelines depend on product category, sampling, and factory booking.`
            : "Average bulk lead times are often 45–60 days after sample approval, depending on category.",
        },
      },
      {
        "@type": "Question",
        name: "Which factory certifications does BIWORSOURCING work with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: s.complianceNote
            ? `We work with factories holding ${s.complianceNote}. Audits and documentation can be shared on request.`
            : "Partner factories typically hold ACCORD, BSCI, SEDEX, WRAP, GOTS or OEKO-TEX certifications as required.",
        },
      },
      {
        "@type": "Question",
        name: "Is BIWORSOURCING a garment buying house or a factory?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BIWORSOURCING is a registered garment buying house and apparel sourcing agent in Dhaka, Bangladesh. We represent the buyer, match the right factory, and manage quality, compliance and shipment.",
        },
      },
    ],
  };

  const productList =
    products.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Apparel product categories sourced",
          numberOfItems: products.length,
          itemListElement: products.slice(0, 20).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: p.name,
              description: p.description,
              category: p.category,
              image: p.image
                ? p.image.startsWith("http")
                  ? p.image
                  : `${siteUrl}${p.image}`
                : undefined,
            },
          })),
        }
      : null;

  const blocks = [organization, website, services, faq, productList].filter(Boolean);

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
