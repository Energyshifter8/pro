const nextConfig = {
  reactStrictMode: true,
  // Fully static site → plain files in out/, served by Firebase Hosting (see firebase.json)
  output: "export",
  // export can't run the image optimizer; every next/image here is an SVG, which skips it anyway
  images: { unoptimized: true },
};
export default nextConfig;
