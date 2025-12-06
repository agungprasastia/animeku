const API_BASE = "https://api.jikan.moe/v4";

async function fetchJSON(url: string) {
  try {
    // FIX: Ganti "no-store" dengan "revalidate" (Cache 1 jam)
    // Ini mencegah Rate Limit (Error 429) karena request tidak dikirim berulang-ulang
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
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

// FIX: Sekarang menggunakan fetchJSON agar aman dari error
export async function getAnimeReviews(id: string, page = 1) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/reviews?page=${page}`);

  return {
    reviews: data?.data || [],
    pagination: data?.pagination || {},
  };
}

// FIX: Sekarang menggunakan fetchJSON agar aman dari error
export async function getAnimeStaff(id: string) {
  const data = await fetchJSON(`${API_BASE}/anime/${id}/staff`);
  return data?.data || [];
}