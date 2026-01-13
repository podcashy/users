export async function handler(event) {
  const uid = event.queryStringParameters?.uid || "MyShop";

  const shortName =
    uid.length > 12 ? uid.substring(0, 12) : uid;

  const manifest = {
    name: `MASOMO SHOP ${uid}`,
    short_name: shortName,
    start_url: `/?uid=${uid}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
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
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(manifest)
  };
}
