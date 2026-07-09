import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone" — обязательно для Docker-образа на основе node server.js
  // Без этого Dockerfile.frontend не найдёт .next/standalone/server.js
  output: "standalone",

  // Разрешаем загрузку изображений с backend (Django media)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "80",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_URL
          ? new URL(process.env.NEXT_PUBLIC_API_URL).hostname
          : "localhost",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
