export async function onRequest(context) {
  const url = "https://furcologist.smugmug.com/hack/feed.mg?Type=NicknameRecentPhotos&Data=furcologist&format=rss200";
  
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*"
      }
    });
    
    if (!response.ok) return new Response(`Error: ${response.status}`, { status: response.status });
    
    return new Response(await response.text(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}