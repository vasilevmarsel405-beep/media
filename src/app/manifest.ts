import type { MetadataRoute } from "next";
import { metaCopy } from "@/lib/copy";
import { siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "КриптоМарс",
    description: metaCopy.description,
    start_url: "/",
    display: "browser",
    background_color: "#fafaf9",
    theme_color: "#ff3100",
    lang: "ru",
    dir: "ltr",
    categories: ["news", "business"],
  };
}
