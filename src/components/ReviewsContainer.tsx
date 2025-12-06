"use client";

import { useState, useMemo } from "react";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Filter } from "lucide-react";

type SortOption = "helpful" | "newest" | "highest_score" | "lowest_score";

export default function ReviewsContainer({ 
  initialReviews, 
  animeId 
}: { 
  initialReviews: any[], 
  animeId: string 
}) {
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<SortOption>("helpful");

  const loadMoreReviews = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const nextPage = page + 1;
      await new Promise(r => setTimeout(r, 500));
      
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/reviews?page=${nextPage}`);
      const data = await res.json();
      
      const newReviews = data.data || [];

      if (newReviews.length === 0) {
        setHasMore(false);
      } else {
        setReviews((prev) => {
          const existingIds = new Set(prev.map(r => r.mal_id));
          const uniqueNewReviews = newReviews.filter((r: any) => !existingIds.has(r.mal_id));
          return [...prev, ...uniqueNewReviews];
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processedReviews = useMemo(() => {
    let data = [...reviews];

    switch (sort) {
      case "newest":
        return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "highest_score":
        return data.sort((a, b) => b.score - a.score);
      case "lowest_score":
        return data.sort((a, b) => a.score - b.score);
      case "helpful":
      default:
        return data.sort((a, b) => b.votes - a.votes);
    }
  }, [reviews, sort]);

  return (
    <div className="space-y-8">
      
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
           <Filter className="h-4 w-4" />
           <span>Showing {processedReviews.length} Reviews</span>
        </div>

        <div className="w-full sm:w-[200px]">
            <Select value={sort} onValueChange={(val: any) => setSort(val)}>
                <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="helpful">✨ Most Helpful</SelectItem>
                    <SelectItem value="newest">📅 Newest</SelectItem>
                    <SelectItem value="highest_score">⭐ Highest Score</SelectItem>
                    <SelectItem value="lowest_score">👎 Lowest Score</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* REVIEW LIST */}
      <div className="space-y-6">
        {processedReviews.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <p className="text-muted-foreground text-lg">No reviews found yet.</p>
          </div>
        ) : (
          processedReviews.map((rev: any, index: number) => (
            <div key={`${rev.mal_id}-${index}`} className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: `${index * 50}ms` }}>
              <ReviewCard review={rev} />
            </div>
          ))
        )}
      </div>

      {/* LOAD MORE BUTTON */}
      {hasMore && (
        <div className="flex justify-center pt-8 pb-12">
          <Button
            onClick={loadMoreReviews}
            disabled={isLoading}
            size="lg"
            variant="outline"
            className="min-w-[200px] rounded-full shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Reviews"
            )}
          </Button>
        </div>
      )}

      {!hasMore && processedReviews.length > 0 && (
        <p className="text-center text-muted-foreground pb-12 text-sm italic">
            You have reached the end of the reviews.
        </p>
      )}

    </div>
  );
}