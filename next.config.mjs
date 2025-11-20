/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "1337",
      //   pathname: "/uploads/**",
      // },
      new URL("http://localhost:1337/**"),
    ],
  },
};

export default nextConfig;
