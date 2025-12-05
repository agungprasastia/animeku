import { getAnimeDetail, getAnimeCharacters } from "@/lib/api";

export default async function AnimeDetail({ params }: { params: any }) {
  const { id } = await params;
  const anime = await getAnimeDetail(id);
  const characters = await getAnimeCharacters(id);

  if (!anime) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Anime not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-4xl font-bold mb-8">{anime.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
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
            <h2 className="text-3xl font-semibold mb-6">Characters & Voice Actors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characters.map((item: any) => (
                <div
                  key={item.character.mal_id}
                  className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl shadow-md"
                >
                  <img
                    src={item.character.images.jpg.image_url}
                    alt={item.character.name}
                    className="w-20 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.character.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.role}</p>

                    {item.voice_actors.length > 0 && (
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={item.voice_actors[0].person.images.jpg.image_url}
                          alt={item.voice_actors[0].person.name}
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
        </div>
      </div>
    </main>
  );
}
