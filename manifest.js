// functions/manifest.js

export const handler = async (event) => {
  // Get UID from query parameter
  const uid = event.queryStringParameters?.uid || '0000';

  // Create dynamic manifest
  const manifest = {
    name: `MyShop ${uid}`,
    short_name: `S-${uid}`,
    start_url: `/index.html?uid=${uid}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#007bff",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      // Allow caching for a short time (optional)
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(manifest)
  };
};
