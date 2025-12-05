import { getTopAnime } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";

export default async function Home() {
  const animeList = await getTopAnime();

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Top Anime</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {animeList.map((anime: any) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </main>
  );
}
