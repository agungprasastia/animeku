"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ExternalLink } from "lucide-react";

const getTagVariant = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes("recommended") && !t.includes("not")) return "default";
  if (t.includes("not recommended")) return "destructive";
  return "secondary";
};

export default function ReviewCard({ review }: { review: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 450; 

  const text = review.review || "";
  const isLong = text.length > MAX_LENGTH;
  const displayedText = isLong && !isExpanded ? text.slice(0, MAX_LENGTH) + "..." : text;

  return (
    <Card className="border-muted bg-card/50 hover:bg-card transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={review.user.images?.jpg?.image_url} />
                <AvatarFallback>{review.user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-semibold leading-none">{review.user.username}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                    {review.episodes_watched && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                            Watched: {review.episodes_watched}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
             <div className="text-right hidden sm:block">
                <span className="text-xs text-muted-foreground block">Overall Score</span>
                <span className="text-xl font-bold text-primary">{review.score}</span>
             </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="flex flex-wrap gap-2 mb-4">
            {review.tags?.map((tag: string, i: number) => (
                <Badge key={i} variant={getTagVariant(tag) as any} className="uppercase text-[10px]">
                    {tag}
                </Badge>
            ))}
             {review.is_spoiler && (
                <Badge variant="destructive" className="uppercase text-[10px]">Spoiler</Badge>
            )}
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {displayedText}
        </div>

        {isLong && (
          <Button 
            variant="link" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-0 mt-2 h-auto font-semibold text-primary"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </Button>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="py-3 flex justify-between items-center bg-muted/20">
         <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{review.votes}</span> helpful
         </div>
         <Link href={review.url} target="_blank">
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground">
                Open on MAL <ExternalLink className="h-3 w-3" />
            </Button>
         </Link>
      </CardFooter>
    </Card>
  );
}