import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",       // Static HTML export
  //  basePath: "/dev-umarfarooq.github.io",
  images: {
    unoptimized: true,    // Required — GitHub Pages has no image optimizer
  },
};

export default nextConfig;