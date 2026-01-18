export async function handler(event) {
  try {
    const uid = event.queryStringParameters?.uid || "MyShop";

    // Fetch shop info from Google Apps Script
    const scriptURL = `https://script.google.com/macros/s/AKfycbx73jH0wY8nELaoKRPNvwNuGKdeSrUV9-PVdt_NU4uyLiNvtkWdExU7l6_oThZpD9dj/exec?uid=${uid}&json=1`;
    const response = await fetch(scriptURL);
    const data = await response.json();

    // Extract shop name from column B (shopName)
    let shopName = uid; // fallback
    if (data.success && data.shopInfo?.shopName) {
      shopName = data.shopInfo.shopName;
    }

    // Process short_name
    let firstWord = shopName.split(' ')[0]; // take first word
    let shortName = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase(); // capitalize first letter
    if (shortName.length > 12) {
      shortName = shortName.substring(0, 12); // max 12 chars
    }

    const manifest = {
      name: `MASOMO SHOP ${shopName}`,
      short_name: shortName,
      start_url: `/?uid=${uid}`,
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons: [
        { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
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

  } catch (err) {
    console.error(err);
    // fallback manifest
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify({
        name: `MASOMO SHOP`,
        short_name: `MyShop`,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      })
    };
  }
}
