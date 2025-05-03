// app/api/proxy-image/route.js
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  // Get the image URL from the query parameter (e.g., ?src=...)
  const imageUrl = searchParams.get("src");

  if (!imageUrl) {
    return new Response(
      JSON.stringify({ error: "Missing 'src' query parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Fetch the image using axios with a custom Referer header
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer", // Get binary data
      headers: {
        // Set a Referer accepted by the remote server
        Referer: "https://mangapark.to",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    // Return the image data with proper headers
    return new Response(response.data, {
      headers: {
        "Content-Type": response.headers["content-type"],
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching image" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
