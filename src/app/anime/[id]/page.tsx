import { 
  getAnimeDetail, 
  getAnimeCharacters, 
  getAnimeRelations, 
  getAnimeStreaming, 
  getAnimeThemes, 
  getAnimeRecommendations,
  getAnimeStaff,
  getAnimeEpisodes,
  getAnimeReviews
} from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Tv, Users, Heart, Calendar, MessageSquare } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSafe(fn: () => Promise<any>, fallback: any) {
  try {
    return await fn();
  } catch (error) {
    return fallback;
  }
}

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AnimeDetail({ params }: PageProps) {
  const { id } = await params;

  const anime = await getAnimeDetail(id);
  if (!anime) return notFound();

  const [streaming, relations] = await Promise.all([
    fetchSafe(() => getAnimeStreaming(id), []),
    fetchSafe(() => getAnimeRelations(id), [])
  ]);
  await delay(1000);

  const [characters, episodesData] = await Promise.all([
    fetchSafe(() => getAnimeCharacters(id), []),
    fetchSafe(() => getAnimeEpisodes(id), { episodes: [] })
  ]);
  await delay(1000);

  const [reviewsData, staff] = await Promise.all([
    fetchSafe(() => getAnimeReviews(id), { reviews: [] }),
    fetchSafe(() => getAnimeStaff(id), [])
  ]);
  await delay(1000);

  const [themes, recommendations] = await Promise.all([
    fetchSafe(() => getAnimeThemes(id), { openings: [], endings: [] }),
    fetchSafe(() => getAnimeRecommendations(id), [])
  ]);

  const episodes = episodesData?.episodes || [];
  const reviews = reviewsData?.reviews || [];
  const sortedCharacters = characters.sort((a: any, b: any) => 
    (a.role === "Main" ? -1 : 1) - (b.role === "Main" ? -1 : 1)
  ).slice(0, 12); 

  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-full md:w-[300px] shrink-0 space-y-6">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl border">
            <Image
              src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
              alt={anime.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>

          <Card>
            <CardHeader className="pb-3"><CardTitle>Information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Type</span><span className="font-medium">{anime.type}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Episodes</span><span className="font-medium">{anime.episodes || "?"}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Status</span><Badge variant="outline">{anime.status}</Badge></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Aired</span><span className="font-medium text-right w-1/2">{anime.aired.string}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Studio</span><span className="font-medium text-right">{anime.studios.map((s: any) => s.name).join(", ") || "-"}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Rating</span><span className="font-medium">{anime.rating}</span></div>
            </CardContent>
          </Card>

          {streaming.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle>Streaming</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {streaming.map((s: any, i: number) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer">
                    <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer py-1">{s.name}</Badge>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{anime.title}</h1>
            {anime.title_english && <p className="text-xl text-muted-foreground mb-4">{anime.title_english}</p>}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <Badge variant="secondary" className="text-lg px-3 py-1 flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> {anime.score || "N/A"}
              </Badge>
              <span className="text-muted-foreground text-sm flex items-center gap-1"><Users className="h-4 w-4" /> {anime.members?.toLocaleString()} Members</span>
              <span className="text-muted-foreground text-sm flex items-center gap-1"><Heart className="h-4 w-4" /> #{anime.popularity} Popularity</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((g: any) => <Badge key={g.mal_id} variant="outline">{g.name}</Badge>)}
              {anime.themes.map((t: any) => <Badge key={t.mal_id} variant="secondary">{t.name}</Badge>)}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>{anime.synopsis}</p>
          </div>

          {anime.trailer?.youtube_id && (
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border bg-muted">
              <iframe src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`} title="Anime Trailer" className="w-full h-full" allowFullScreen />
            </div>
          )}

          {/* TABS AREA */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="songs">Songs</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
            </TabsList>
            
            {/* OVERVIEW CONTENT */}
            <TabsContent value="overview" className="space-y-8 mt-6">
              {relations.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Tv className="h-5 w-5" /> Related Anime</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {relations.map((rel: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-4 bg-card/50">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">{rel.relation}</span>
                        <div className="flex flex-col gap-1">
                          {rel.entry.map((entry: any) => (
                            <Link key={entry.mal_id} href={entry.type === "anime" ? `/anime/${entry.mal_id}` : "#"} className={`text-sm font-medium hover:text-primary transition-colors ${entry.type !== "anime" && "pointer-events-none opacity-60"}`}>
                              {entry.name} <span className="text-xs text-muted-foreground">({entry.type})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {sortedCharacters.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="h-5 w-5" /> Main Characters</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sortedCharacters.map((char: any) => (
                      <div key={char.character.mal_id} className="flex items-center gap-3 border rounded-lg p-2 bg-card hover:border-primary/50 transition-colors">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border">
                          <Image src={char.character.images.jpg.image_url} alt={char.character.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{char.character.name}</p>
                          <p className="text-xs text-muted-foreground">{char.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </TabsContent>

            {/* SONGS CONTENT */}
            <TabsContent value="songs" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader><CardTitle className="text-base">Opening Themes</CardTitle></CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {themes.openings?.length ? themes.openings.map((op: string, i: number) => <li key={i} className="py-1 border-b last:border-0 border-border/50">{op}</li>) : <li>No opening themes found.</li>}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Ending Themes</CardTitle></CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {themes.endings?.length ? themes.endings.map((ed: string, i: number) => <li key={i} className="py-1 border-b last:border-0 border-border/50">{ed}</li>) : <li>No ending themes found.</li>}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* REVIEWS CONTENT */}
            <TabsContent value="reviews" className="mt-6 space-y-8">
               {reviews.length > 0 ? (
                 <>
                   <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold">Top Reviews</h3>
                   </div>
                   
                   <div className="grid gap-6">
                      {reviews.slice(0, 2).map((review: any) => (
                        <ReviewCard key={review.mal_id} review={review} />
                      ))}
                   </div>

                   <div className="flex justify-center pt-4">
                     <Link href={`/anime/${id}/reviews`}>
                       <Button size="lg" className="rounded-full px-8 shadow-lg hover:scale-105 transition-transform">
                          Read All Reviews
                       </Button>
                     </Link>
                   </div>
                 </>
               ) : (
                 <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                    <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground">No reviews available yet.</p>
                 </div>
               )}
            </TabsContent>

            {/* EPISODES CONTENT */}
            <TabsContent value="episodes" className="mt-6">
               <Card>
                 <CardHeader className="pb-4 border-b">
                    <CardTitle className="flex justify-between items-center text-lg">Episode List <Badge variant="secondary" className="text-xs font-normal">{episodes.length} Episodes Loaded</Badge></CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                   <ScrollArea className="h-[500px] w-full">
                     {episodes.length > 0 ? (
                       <div className="divide-y">
                         {episodes.map((ep: any) => (
                           <div key={ep.mal_id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                             <div className="flex-shrink-0 w-12 text-center"><span className="text-2xl font-bold text-muted-foreground/50">#{ep.mal_id}</span></div>
                             <div className="flex-grow min-w-0">
                               <div className="flex items-center gap-2 mb-1">
                                 <h4 className="font-semibold text-sm truncate">{ep.title}</h4>
                                 {ep.filler && <Badge variant="destructive" className="text-[10px] h-4 px-1">Filler</Badge>}
                                 {ep.recap && <Badge variant="outline" className="text-[10px] h-4 px-1">Recap</Badge>}
                               </div>
                               <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                 <span className="truncate">{ep.title_japanese}</span>
                                 {ep.aired && <span className="flex items-center gap-1 shrink-0"><Calendar className="h-3 w-3" /> {new Date(ep.aired).toLocaleDateString()}</span>}
                               </div>
                             </div>
                             {ep.score && <div className="flex-shrink-0 text-right"><Badge variant="secondary" className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {ep.score}</Badge></div>}
                           </div>
                         ))}
                       </div>
                     ) : <div className="flex flex-col items-center justify-center py-16 text-muted-foreground"><Tv className="h-12 w-12 mb-4 opacity-20" /><p>No episode information available.</p></div>}
                   </ScrollArea>
                 </CardContent>
               </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}