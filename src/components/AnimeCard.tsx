import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Props {
  anime: any;
}

export default function AnimeCard({ anime }: Props) {
  return (
    <Link href={`/anime/${anime.mal_id}`} className="group h-full block">
      <Card className="overflow-hidden h-full border-muted bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Overlay Score */}
          {anime.score && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="flex items-center gap-1 font-bold shadow-sm backdrop-blur-sm bg-background/80">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {anime.score}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
            {anime.genres?.[0] && (
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                    {anime.genres[0].name}
                </p>
            )}
            <h3 className="font-bold text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {anime.title}
            </h3>
        </CardContent>
      </Card>
    </Link>
  );
}