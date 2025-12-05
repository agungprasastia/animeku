import { 
  getAnimeDetail, getAnimeCharacters, getAnimeRecommendations, getAnimeEpisodes } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function AnimeDetail({
  params,
  searchParams = {},
}: {
  params: any;
  searchParams?: any;
}) {
  let resolvedParams = params;
  if (params && typeof params.then === "function") {
    resolvedParams = await params;
  }

  const id = resolvedParams?.id;
  const pageNumber = Number(
    (searchParams && searchParams.page) ? searchParams.page : 1
  );

  if (!id) return notFound();

  const anime = await getAnimeDetail(id);
  if (!anime) return notFound();

  const [characters, recommendations] = await Promise.all([
    getAnimeCharacters(id),
    getAnimeRecommendations(id),
  ]);

  const { episodes, pagination } = await getAnimeEpisodes(id, pageNumber);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-4xl font-bold mb-8">{anime.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">

        {/* POSTER */}
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="w-full rounded-lg shadow-lg"
        />

        <div className="space-y-10">

          {/* SYNOPSIS */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
          </section>

          {/* GENRES */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((g: any) => (
                <span 
                  key={g.mal_id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </section>

          {/* STATS */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <p><strong>Score:</strong> {anime.score}</p>
              <p><strong>Rank:</strong> #{anime.rank}</p>
              <p><strong>Popularity:</strong> {anime.popularity}</p>
              <p><strong>Members:</strong> {anime.members}</p>
              <p><strong>Episodes:</strong> {anime.episodes}</p>
              <p><strong>Status:</strong> {anime.status}</p>
            </div>
          </section>

          {/* STUDIOS */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Studios</h2>
            <p>{anime.studios.map((s: any) => s.name).join(", ")}</p>
          </section>

          {/* TRAILER */}
          {anime.trailer?.embed_url && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Trailer</h2>
              <iframe
                src={anime.trailer.embed_url}
                width="100%"
                height="315"
                allowFullScreen
                className="rounded-lg shadow-lg"
              />
            </section>
          )}

          {/* CHARACTERS */}
          <section className="mt-16">
            <h2 className="text-3xl font-semibold mb-6">
              Characters & Voice Actors
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characters.map((item: any) => (
                <div
                  key={item.character.mal_id}
                  className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl shadow-md"
                >
                  <img
                    src={item.character.images.jpg.image_url}
                    className="w-20 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.character.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.role}</p>

                    {item.voice_actors[0] && (
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={item.voice_actors[0].person.images.jpg.image_url}
                          className="w-12 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {item.voice_actors[0].person.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {item.voice_actors[0].language}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RECOMMENDATIONS */}
          <section className="mt-20">
            <h2 className="text-3xl font-semibold mb-6">Recommended Anime</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.map((rec: any) => (
                <a
                  key={rec.entry.mal_id}
                  href={`/anime/${rec.entry.mal_id}`}
                  className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
                >
                  <img
                    src={rec.entry.images.jpg.image_url}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold text-sm group-hover:text-blue-400">
                      {rec.entry.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* EPISODE LIST */}
          <section className="mt-20">
            <h2 className="text-3xl font-semibold mb-6">Episodes</h2>

            {episodes.length === 0 ? (
              <p className="text-gray-400">No episodes available.</p>
            ) : (
              <div className="space-y-4">
                {episodes.map((ep: any) => (
                  <div
                    key={ep.mal_id}
                    className="p-4 bg-gray-900 rounded-lg shadow-md flex justify-between"
                  >
                    <div>
                      <p className="font-bold text-lg">
                        Episode {ep.mal_id}: {ep.title || "Untitled"}
                      </p>
                      {ep.aired && (
                        <p className="text-gray-400 text-sm">Aired: {ep.aired}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
              {pagination.current_page > 1 ? (
                <a
                  href={`/anime/${id}?page=${pagination.current_page - 1}`}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  ← Previous
                </a>
              ) : (
                <span className="px-4 py-2 text-gray-600">← Previous</span>
              )}

              <span className="text-gray-300">
                Page {pagination.current_page} / {pagination.last_visible_page}
              </span>

              {pagination.has_next_page ? (
                <a
                  href={`/anime/${id}?page=${pagination.current_page + 1}`}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Next →
                </a>
              ) : (
                <span className="px-4 py-2 text-gray-600">Next →</span>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
