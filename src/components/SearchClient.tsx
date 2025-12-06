"use client";

import { useState, useEffect, useRef } from "react";
import AnimeCard from "@/components/AnimeCard";
import { searchAnime } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function SearchClient() {
    const [q, setQ] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<number | undefined>(undefined);
    
    useEffect(() => {
        if(!q) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        window.clearTimeout(debounceRef.current);

        debounceRef.current = window.setTimeout(async () => {
            try {
                const data = await searchAnime(q, 24);
                setResults(data);
            } catch (err: any) {
                setError("Gagal mencari. Coba lagi.");
            } finally {
                setLoading(false);
            }
        }, 450);

        return () => window.clearTimeout(debounceRef.current);
    }, [q]);

    return (
        <div className="py-8 space-y-8">
            <div className="relative max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari anime favoritmu..."
                        value={q}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
                        className="pl-10 h-12 text-lg rounded-full shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
                    />
                </div>
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {error && (
                <div className="text-center p-4 bg-destructive/10 text-destructive rounded-lg">
                    {error}
                </div>
            )}

            {!loading && !q && (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg">Mulai ketik untuk menemukan anime baru.</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map((anime: any) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
            </div>

            {!loading && q && results.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>Tidak ditemukan hasil untuk <span className="font-bold text-foreground">“{q}”</span>.</p>
                </div>
            )}
        </div>
  );
}