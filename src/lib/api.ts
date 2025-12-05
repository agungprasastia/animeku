export async function getTopAnime() {
  const res = await fetch("https://api.jikan.moe/v4/top/anime");
  const data = await res.json();
  return data.data;
}

export async function getAnimeDetail(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  const data = await res.json();
  return data.data;
}

export async function searchAnime(query: string, limit = 20) {
  if (!query || query.trim() === "") {
    return [];
  }
  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data || [];
}

export async function getAnimeCharacters(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
  const data = await res.json();
  return data.data || [];
}

export async function getAnimeRecommendations(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
  const data = await res.json();
  return data.data || [];
}

export async function getAnimeEpisodes(id: string, page = 1) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`);
  const data = await res.json();
  return {
    episodes: data.data || [],
    pagination: data.pagination || {},
  };
}

export async function getAnimeStreaming(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/streaming`);
  const data = await res.json();
  return data.data || [];
}

