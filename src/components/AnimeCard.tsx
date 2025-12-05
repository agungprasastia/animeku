import Link from "next/link";

interface Props {
  anime: any;
}

export default function AnimeCard({ anime }: Props) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="border rounded-lg p-3 hover:shadow-lg transition cursor-pointer">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="rounded-md mb-2 w-full"
        />
        <h2 className="font-semibold text-sm">{anime.title}</h2>
      </div>
    </Link>
  );
}
