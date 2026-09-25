import { getSettings } from "@/lib/data";

export default function JsonLd() {
  const s = getSettings() as any;
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.companyName || "BIWORSOURCING",
    url: siteUrl,
    logo: s.logo ? (s.logo.startsWith("http") ? s.logo : `${siteUrl}${s.logo}`) : undefined,
    description: s.metaDescription,
    email: s.email,
    telephone: s.phone || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: s.address || "Dhaka",
      addressCountry: "BD",
    },
    sameAs: [
      s.facebookUrl,
      s.linkedinUrl,
      s.instagramUrl,
      s.twitterUrl,
    ].filter(Boolean),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.companyName || "BIWORSOURCING",
    url: siteUrl,
    description: s.metaDescription,
    publisher: { "@type": "Organization", name: s.companyName },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: s.companyName || "BIWORSOURCING",
    description: s.metaDescription,
    url: siteUrl,
    email: s.email,
    telephone: s.phone || undefined,
    areaServed: "Worldwide",
    serviceType: "Apparel Sourcing / Garment Buying House",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
    </>
  );
}
