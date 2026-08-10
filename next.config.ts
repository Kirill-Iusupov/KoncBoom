import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone" — обязательно для Docker-образа на основе node server.js
  output: "standalone",
  allowedDevOrigins: ['agglomerative-elliot-unobstinately.ngrok-free.dev'],
  // Разрешаем загрузку изображений с backend (Django media)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "agglomerative-elliot-unobstinately.ngrok-free.dev",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
