import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Tv } from "lucide-react"; 

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="bg-primary p-1.5 rounded-lg">
            <Tv className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">AnimeKu</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="text-sm font-medium">
              Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="ghost" className="text-sm font-medium gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}