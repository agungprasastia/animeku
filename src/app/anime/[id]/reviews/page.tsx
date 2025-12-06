import { getAnimeDetail, getAnimeReviews } from "@/lib/api";
import ReviewsContainer from "@/components/ReviewsContainer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewsPage({ params }: PageProps) {
  const { id } = await params;

  const [anime, reviewsData] = await Promise.all([
    getAnimeDetail(id),
    getAnimeReviews(id),
  ]);

  return (
    <main className="min-h-screen py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b pb-8">
        <Link href={`/anime/${id}`}>
          <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Anime Detail
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-24 h-36 shrink-0 rounded-lg overflow-hidden shadow-md border">
               <Image 
                 src={anime.images.jpg.image_url} 
                 alt={anime.title} 
                 fill 
                 className="object-cover"
               />
            </div>
            
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Reviews for {anime.title}</h1>
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm px-2 py-0.5 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        {anime.score} Overall Score
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                        Total Reviews: {reviewsData.pagination?.items?.total || "Many"}
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* CLIENT CONTAINER */}
      <ReviewsContainer 
        initialReviews={reviewsData.reviews} 
        animeId={id} 
      />
    </main>
  );
}