import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false, // this is explicitly putted here to remove that nextjs button at the home page of the project.
};

export default nextConfig;
