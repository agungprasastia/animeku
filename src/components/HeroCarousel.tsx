"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Star, Calendar, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  animeList: any[];
}

export default function HeroCarousel({ animeList }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animeList.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [animeList.length]);

  const currentAnime = animeList[currentIndex];

  if (!currentAnime) return null;

  return (
    <section className="relative w-full h-[500px] flex items-center overflow-hidden rounded-2xl shadow-xl mx-auto max-w-6xl mt-6 group">
      
      {/* --- BACKGROUND IMAGE LAYERS (Cross-fade effect) --- */}
      {animeList.map((anime, index) => (
        <div
          key={anime.mal_id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          )}
        >
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
      ))}

      {/* --- CONTENT LAYER --- */}
      <div className="container relative z-10 px-8 grid md:grid-cols-2 items-center h-full">
        <div key={currentIndex} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 py-8">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground/90">
            <Badge variant="secondary" className="flex gap-1 items-center backdrop-blur-sm bg-background/50">
               <Tv className="w-3 h-3" /> {currentAnime.type}
            </Badge>
            <span className="flex items-center gap-1 bg-background/30 px-2 py-0.5 rounded-md backdrop-blur-sm text-foreground font-bold">
               <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {currentAnime.score}
            </span>
            <span className="flex items-center gap-1 text-foreground/80 font-medium">
               <Calendar className="w-4 h-4 opacity-70" /> {currentAnime.year || "Unknown"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground drop-shadow-sm line-clamp-2">
            {currentAnime.title}
          </h1>

          {/* Synopsis */}
          <p className="text-base md:text-lg text-foreground/90 line-clamp-3 max-w-lg leading-relaxed drop-shadow-sm font-medium">
            {currentAnime.synopsis}
          </p>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {currentAnime.genres?.slice(0, 4).map((genre: any) => (
              <Badge key={genre.mal_id} variant="outline" className="text-xs px-2 py-0.5 border-foreground/20 text-foreground/80 bg-background/20 backdrop-blur-sm">
                {genre.name}
              </Badge>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/anime/${currentAnime.mal_id}`}>
                <Button className="rounded-full px-6 gap-2 font-bold shadow-lg transition-transform active:scale-95">
                    <Info className="w-4 h-4" /> More Info
                </Button>
            </Link>
            {currentAnime.trailer?.url && (
                <Link href={currentAnime.trailer.url} target="_blank">
                    <Button variant="secondary" className="rounded-full px-6 gap-2 font-bold bg-background/40 backdrop-blur-md border border-white/10 hover:bg-background/60 text-foreground">
                        <Play className="w-4 h-4 fill-current" /> Watch Trailer
                    </Button>
                </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- CAROUSEL INDICATORS (DOTS) --- */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-2">
        {animeList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              idx === currentIndex 
                ? "bg-primary w-6" 
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
}