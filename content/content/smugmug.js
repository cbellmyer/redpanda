export async function onRequest(context) {
  const url = "https://furcologist.smugmug.com/hack/feed.mg?Type=NicknameRecentPhotos&Data=furcologist&format=rss200";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*"
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `SmugMug returned ${response.status}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const xmlText = await response.text();

    // Extract items using regex to avoid heavy DOM parsing at the edge
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];

      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const mediaMatch = itemXml.match(/<media:content[^>]+url="([^"]+)"/i) || itemXml.match(/<enclosure[^>]+url="([^"]+)"/i);

      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : "Field Update";
      const link = linkMatch ? linkMatch[1].trim() : "#";
      const image = mediaMatch ? mediaMatch[1] : null;

      if (image) items.push({ title, link, image });
      if (items.length >= 6) break; // We only need 6 for the grid
    }

    return new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
