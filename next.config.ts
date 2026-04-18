import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",       // Static HTML export
  images: {
    unoptimized: true,    // Required — GitHub Pages has no image optimizer
  },
};

export default nextConfig;