import { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  const s = getSettings();
  return {
    name: s.companyName || "BIWORSOURCING",
    short_name: "BIWOR",
    description: s.metaDescription || "Apparel sourcing agent in Bangladesh",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
  };
}
