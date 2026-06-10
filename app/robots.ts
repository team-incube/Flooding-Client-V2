import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://flooding.kr";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/club/*", "/dormitory/*", "/school/*"],
        disallow: [
          "/students/*",
          "/api/*",
          "/callback/*",
          "/_next/*",
          "/static/*",
        ],
      },
      {
        userAgent: "*",
        allow: ["/", "/club/*", "/dormitory/*", "/school/*"],
        disallow: [
          "/students/*",
          "/api/*",
          "/callback/*",
          "/_next/*",
          "/static/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
