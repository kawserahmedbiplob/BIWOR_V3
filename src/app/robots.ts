import { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  const s = getSettings() as any;
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");
  const allowIndex = s.robotsIndex !== false;

  return {
    rules: allowIndex
      ? { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
