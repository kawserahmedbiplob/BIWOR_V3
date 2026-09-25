import { getSettings } from "@/lib/data";

export async function GET() {
  const s = getSettings() as any;
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");
  const body = `# ${s.companyName || "BIWORSOURCING"}

> ${s.metaDescription || "Apparel sourcing agent and garment buying house in Bangladesh."}

## About
- Company: ${s.companyName || "BIWORSOURCING"}
- Type: Garment buying house / apparel sourcing agent
- Location: ${s.address || "Dhaka, Bangladesh"}
- Email: ${s.email || ""}
- Website: ${siteUrl}

## Services
- Factory matching and sourcing (knit, woven, denim, outerwear, activewear)
- Private label and product development
- Quality control and AQL inspection
- Compliance (BSCI, SEDEX, WRAP, GOTS, OEKO-TEX, ACCORD)
- Shipping and export documentation
- After-shipment support

## Key facts
- MOQ: ${s.moqNote || "From ~500 pieces"}
- Lead time: ${s.leadTimeNote || "Typically 45–60 days"}
- Compliance: ${s.complianceNote || "Certified partner factories"}

## Contact
- Schedule a meeting: ${siteUrl}/#contact
- Email: ${s.email || ""}

## Pages
- Home: ${siteUrl}/
- About: ${siteUrl}/#about
- Services: ${siteUrl}/#services
- Products: ${siteUrl}/#products
- Contact: ${siteUrl}/#contact
- Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
