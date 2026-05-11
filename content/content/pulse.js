export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  // Handle CORS preflight requests immediately
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Strict User-Agent for Fediverse instance compliance
  const reqHeaders = {
    'User-Agent': 'RedPanda-OmniPulse/1.0 (+https://redpanda.pet)',
    'Accept': 'application/json'
  };

  const discordId = env.DISCORD_ID || '104330735866884096';
  const steamApiKey = env.STEAM_API_KEY;
  const steamId = env.STEAM_ID || '76561198031520165';
  const pixelfedApi = env.PIXELFED_API || 'https://pixelfed.social/api/v1/accounts/788179060854074461/statuses?limit=1';
  const mastodonApi = env.MASTODON_API || 'https://mastodon.social/api/v1/accounts/110373887192663991/statuses?limit=1';
  const smugmugUrl = env.SMUGMUG_URL || 'https://photo.redpanda.pet/';
  const xUrl = env.X_URL || 'https://twitter.com/furcologist';

  const signals = [];

  try {
    // 1. DISCORD (Lanyard API)
    if (discordId) {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        if (res.ok) {
          const { data } = await res.json();
          const isOnline = data.discord_status !== "offline";
          const activity = data.activities?.find(a => a.type === 0) || data.activities?.[0];

          signals.push({
            source: 'Discord',
            label: isOnline ? 'LIVE' : 'OFFLINE',
            text: activity ? activity.name : (isOnline ? 'Online' : 'Offline'),
            url: `https://discord.com/users/${discordId}`,
            isActive: isOnline,
            timestamp: Date.now() // For Discord, 'active' essentially means right now
          });
        }
      } catch (e) { console.error("Discord error", e); }
    }

    // 2. STEAM
    if (steamApiKey && steamId) {
      try {
        const res = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}&format=json`);
        if (res.ok) {
          const data = await res.json();
          const player = data.response?.players?.[0];

          if (player) {
            const isPlaying = !!player.gameextrainfo;
            signals.push({
              source: 'Steam',
              label: isPlaying ? 'GAMING' : 'OFFLINE',
              text: isPlaying ? `Playing ${player.gameextrainfo}` : 'Offline',
              url: `https://steamcommunity.com/profiles/${steamId}`,
              isActive: isPlaying,
              timestamp: isPlaying ? Date.now() : (player.lastlogoff * 1000)
            });
          }
        }
      } catch (e) { console.error("Steam error", e); }
    }

    // 3. PIXELFED & MASTODON
    const fetchFedi = async (url, label, sourceName) => {
      try {
        const res = await fetch(url, { headers: reqHeaders });
        if (!res.ok) return null;
        const posts = await res.json();
        if (posts && posts.length > 0) {
          let content = posts[0].content.replace(/<[^>]*>?/gm, '').trim();
          content = content.length > 80 ? content.substring(0, 77) + '...' : content;
          return {
            source: sourceName,
            label: label,
            text: content || 'New post!',
            url: posts[0].url,
            isActive: false, // Social feeds aren't strictly 'live'
            timestamp: new Date(posts[0].created_at).getTime()
          };
        }
      } catch (e) { console.error(`${sourceName} error`, e); }
      return null;
    };

    const [px, mstdn] = await Promise.allSettled([
      pixelfedApi ? fetchFedi(pixelfedApi, 'PHOTO', 'Pixelfed') : Promise.resolve(null),
      mastodonApi ? fetchFedi(mastodonApi, 'SOCIAL', 'Mastodon') : Promise.resolve(null)
    ]);

    if (px.status === 'fulfilled' && px.value) signals.push(px.value);
    if (mstdn.status === 'fulfilled' && mstdn.value) signals.push(mstdn.value);

    // 4. SMUGMUG
    if (smugmugUrl) {
      signals.push({
        source: 'Portfolio',
        label: 'GALLERY',
        text: 'Recent photo updates',
        url: smugmugUrl,
        isActive: false,
        timestamp: 0 // Will sit at the bottom, dimmed out
      });
    }

    // 5. X (TWITTER) FALLBACK
    if (xUrl) {
      signals.push({
        source: 'X',
        label: 'X',
        text: 'Archive',
        url: xUrl,
        isActive: false,
        timestamp: 0
      });
    }

    // Sort descending by timestamp so newest active feeds drop to the top
    signals.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return new Response(JSON.stringify(signals), { headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}
