export async function handler(event) {
  const uid = event.queryStringParameters?.uid || "default";

  const rawName = event.queryStringParameters?.name || uid;

  // Format short name: Max 12 chars, Capitalize first letter
  let shortName = rawName.split(" ")[0];
  shortName = shortName.substring(0, 12);
  shortName = shortName.charAt(0).toUpperCase() + shortName.slice(1).toLowerCase();

  const manifest = {
    id: `/app/${uid}/`,              // 🔥 VERY IMPORTANT
    name: `MASOMO ${rawName}`,
    short_name: shortName,
    start_url: `/app/${uid}/`,
    scope: `/app/${uid}/`,
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
