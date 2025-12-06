const API_BASE = "https://api.jikan.moe/v4";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJSON(url: string, retries = 3, delayDuration = 1000) {
  try {
    const res = await fetch(url, { 
      cache: "force-cache", 
      next: { revalidate: 86400 } 
    });

    if (res.status === 429) {
      if (retries > 0) {
        const jitter = Math.floor(Math.random() * 500);
        const totalDelay = delayDuration + jitter;
        
        console.warn(`RATE LIMIT (429): ${url}. Retrying in ${totalDelay}ms...`);
        await wait(totalDelay);

        return fetchJSON(url, retries - 1, delayDuration * 2); 
      } else {
        console.error(`Gagal total (Max Retries): ${url}`);
        return null;
      }
    }

    if (!res.ok) {
      console.warn(`API Error ${res.status} for ${url}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Network Error:", err);
    return null;
  }
}

export async function getTopAnime() {
  const data = await fetchJSON(`${API_BASE}/top/anime`);
  return data?.data || [];
}

export async function getAnimeDetail(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}`);
  return data?.data || null;
}

export async function searchAnime(query: string, limit = 20) {
  if (!query.trim()) return [];
  const data = await fetchJSON(`${API_BASE}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
  return data?.data || [];
}

export async function getAnimeCharacters(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/characters`);
  return data?.data || [];
}

export async function getAnimeRecommendations(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/recommendations`);
  return data?.data || [];
}

export async function getAnimeEpisodes(id: string, page = 1) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/episodes?page=${page}`);

  return {
    episodes: data?.data || [],
    pagination: data?.pagination || {
      current_page: 1,
      last_visible_page: 1,
      has_next_page: false
    }
  };
}

export async function getAnimeStreaming(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/streaming`);
  return data?.data || [];
}

export async function getAnimeReviews(id: string, page = 1) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/reviews?page=${page}`);

  return {
    reviews: data?.data || [],
    pagination: data?.pagination || {},
  };
}

export async function getAnimeStaff(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/staff`);
  return data?.data || [];
}

export async function getAnimeRelations(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/relations`);
  return data?.data || [];
}

export async function getAnimeThemes(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/themes`);
  return data?.data || { openings: [], endings: [] };
}