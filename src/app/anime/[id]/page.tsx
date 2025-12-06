import {
  getAnimeDetail,
  getAnimeCharacters,
  getAnimeRecommendations,
  getAnimeEpisodes,
  getAnimeStreaming,
  getAnimeReviews
} from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function AnimeDetail({ params, searchParams }: Props) {
  const { id } = await params;
  if (!id) return notFound();

  const query = await searchParams;
  const pageNumber = Number(query?.page ?? 1);

  const anime = await getAnimeDetail(id);
  if (!anime) return notFound();

  const [streaming, characters] = await Promise.all([
    getAnimeStreaming(id),
    getAnimeCharacters(id)
  ]);

  await delay(800);

  const [recommendations, episodesData] = await Promise.all([
    getAnimeRecommendations(id),
    getAnimeEpisodes(id, pageNumber)
  ]);

  const { episodes, pagination } = episodesData;

  await delay(800);

  const { reviews, pagination: reviewPagination } = await getAnimeReviews(id, 1);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-4xl font-bold mb-8">{anime.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
        
        {/* POSTER */}
        <img
          src={anime.images?.jpg?.large_image_url}
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
              {anime.genres?.map((g: any) => (
                <span key={g.mal_id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {g.name}
                </span>
              ))}
            </div>
          </section>

          {/* STATS */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <p><strong>Score:</strong> {anime.score ?? "—"}</p>
              <p><strong>Rank:</strong> #{anime.rank ?? "—"}</p>
              <p><strong>Popularity:</strong> {anime.popularity ?? "—"}</p>
              <p><strong>Members:</strong> {anime.members ?? "—"}</p>
              <p><strong>Episodes:</strong> {anime.episodes ?? "—"}</p>
              <p><strong>Status:</strong> {anime.status ?? "—"}</p>
            </div>
          </section>

          {/* STUDIOS */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Studios</h2>
            <p>{anime.studios?.map((s: any) => s.name).join(", ") ?? "—"}</p>
          </section>

          {/* TRAILER */}
          {anime.trailer?.embed_url && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Trailer</h2>
              <iframe
                src={anime.trailer.embed_url}
                className="w-full h-72 rounded-lg shadow-lg"
                allowFullScreen
              />
            </section>
          )}

          {/* STREAMING */}
          {streaming.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Watch On (Legal Streaming)</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {streaming.map((site: any, index: number) => (
                  <a
                    key={index}
                    href={site.url}
                    target="_blank"
                    className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:bg-gray-800 transition"
                  >
                    <p className="text-lg font-semibold">{site.name}</p>
                    <p className="text-gray-400 text-sm">Click to watch</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* CHARACTERS */}
          <section className="mt-16">
            <h2 className="text-3xl font-semibold mb-6">Characters & Voice Actors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characters.map((item: any) => (
                <div key={item.character.mal_id} className="p-4 bg-gray-900 rounded-xl shadow-md flex gap-4">
                  <img
                    src={item.character.images?.jpg?.image_url}
                    className="w-20 h-28 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.character.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.role}</p>

                    {item.voice_actors?.[0] && (
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={item.voice_actors[0].person.images?.jpg?.image_url}
                          className="w-12 h-16 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.voice_actors[0].person.name}</p>
                          <p className="text-gray-400 text-xs">{item.voice_actors[0].language}</p>
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
                <Link key={rec.entry.mal_id} href={`/anime/${rec.entry.mal_id}`} className="group block bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition">
                  <img src={rec.entry.images?.jpg?.image_url} className="w-full h-60 object-cover" />
                  <div className="p-3">
                    <p className="font-semibold text-sm group-hover:text-blue-400">{rec.entry.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* REVIEWS */}
          <section className="mt-20">
            <h2 className="text-3xl font-semibold mb-6">Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews available.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev: any, i: number) => (
                  <div key={i} className="bg-gray-900 p-5 rounded-xl shadow-md border border-gray-700">
                    <div className="flex items-start gap-4">

                      <img
                        src={rev.user.images?.jpg?.image_url ?? "/default-avatar.png"}
                        className="w-14 h-14 rounded-full object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{rev.user.username}</h3>
                          <span className="px-3 py-1 bg-blue-600 rounded-lg text-sm">
                            Score: {rev.score ?? "—"}
                          </span>
                        </div>

                        <p className="text-gray-300 mt-2 line-clamp-4">{rev.review}</p>

                        <p className="text-gray-500 text-sm mt-2">
                          Helpful: {rev.votes} 👍
                        </p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewPagination?.has_next_page && (
              <button className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
                Load more reviews →
              </button>
            )}
          </section>

          {/* EPISODES */}
          <section className="mt-20">
            <h2 className="text-3xl font-semibold mb-6">Episodes</h2>

            {episodes.length === 0 ? (
              <p className="text-gray-400">No episodes available.</p>
            ) : (
              <div className="space-y-4">
                {episodes.map((ep: any) => (
                  <div key={ep.mal_id} className="p-4 bg-gray-900 rounded-lg shadow-md">
                    <p className="font-bold text-lg">
                      Episode {ep.mal_id}: {ep.title || "Untitled"}
                    </p>
                    {ep.aired && <p className="text-gray-400 text-sm">Aired: {ep.aired}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* EPISODE PAGINATION */}
            <div className="flex justify-between items-center mt-6">
              {pagination?.current_page > 1 ? (
                <Link href={`/anime/${id}?page=${pagination.current_page - 1}`} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                  ← Previous
                </Link>
              ) : (
                <span className="px-4 py-2 text-gray-600">← Previous</span>
              )}

              <span className="text-gray-300">
                Page {pagination?.current_page ?? 1} / {pagination?.last_visible_page ?? 1}
              </span>

              {pagination?.has_next_page ? (
                <Link href={`/anime/${id}?page=${pagination.current_page + 1}`} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                  Next →
                </Link>
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