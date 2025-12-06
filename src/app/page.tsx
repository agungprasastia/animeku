import { getTopAnime } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";
import HeroCarousel from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const topAnime = await getTopAnime();
  const carouselAnime = topAnime.slice(0, 5);
  const remainingAnime = topAnime.slice(5);

  return (
    <main className="min-h-screen pb-12 space-y-12">
      
      {/* --- HERO CAROUSEL SECTION --- */}
      {carouselAnime.length > 0 && (
        <HeroCarousel animeList={carouselAnime} />
      )}

      {/* --- GRID SECTION --- */}
      <div className="container mx-auto px-6 space-y-6">
        <div className="flex items-center justify-between border-l-4 border-primary pl-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
                <p className="text-muted-foreground">Top anime this week</p>
            </div>
            <Link href="/search">
                <Button variant="outline" size="sm">View All</Button>
            </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {remainingAnime.map((anime: any, index: number) => (
            <div key={anime.mal_id} className="animate-in fade-in duration-700" style={{ animationDelay: `${index * 50}ms` }}>
                <AnimeCard anime={anime} />
            </div>
            ))}
        </div>
      </div>

    </main>
  );
}