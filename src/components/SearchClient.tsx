"use client";

import { useState, useEffect, useRef } from "react";
import AnimeCard from "@/components/AnimeCard";
import { searchAnime } from "@/lib/api";

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
        <div className="py-6">
            <div className="mb-4">
                <input
                    type="search"
                    placeholder="Search anime..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full md:w-2/3 p-3 rounded-lg border bg-white/5 placeholder:text-gray-300 focus:outline-none"
                />
            </div>

             {loading && <p className="text-sm mb-4">Mencari...</p>}
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!loading && !q && (
        <p className="text-sm text-gray-400">Mulai ketik untuk mencari anime.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {results.map((anime: any) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {!loading && q && results.length === 0 && (
        <p className="mt-6 text-gray-400">Tidak ditemukan hasil untuk “{q}”.</p>
      )}
    </div>
  );
}