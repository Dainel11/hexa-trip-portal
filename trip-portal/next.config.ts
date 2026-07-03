import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sheet-hosted images can come from anywhere (Drive, googleusercontent, Imgur, etc.).
  // We render them with a plain <img>, so no domain all-listing is required here.
  reactStrictMode: true,
};

export default nextConfig;
