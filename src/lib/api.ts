const API_BASE = "https://api.jikan.moe/v4";

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
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
