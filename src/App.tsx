import { useState, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { ArtworkGrid } from "@/components/artwork-grid";
import { ArtworkDetail } from "@/components/artwork-detail";
import { FavoritesView } from "@/components/favorites-view";
import { Pagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchArtworks } from "@/hooks/use-artworks";
import { useFavorites } from "@/hooks/use-favorites";
import type { Artwork } from "@/lib/api";
import { Heart } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_QUERY = "impressionism";

type View = "explore" | "favorites";

function App() {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY);
  const [page, setPage] = useState(1);
  const [selectedArtworkId, setSelectedArtworkId] = useState<number | null>(
    null
  );
  const [view, setView] = useState<View>("explore");

  const { favoriteIds, favoriteCount, toggleFavorite, isFavorite } =
    useFavorites();

  const { data, isLoading, isFetching } = useSearchArtworks(searchQuery, page);

  const artworks =
    data?.data.filter((a: Artwork) => a.image_id !== null) ?? [];
  const pagination = data?.pagination;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query || DEFAULT_QUERY);
    setPage(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFavorite = useCallback(
    (id: number) => {
      const adding = !isFavorite(id);
      toggleFavorite(id);
      toast(adding ? "Added to favorites" : "Removed from favorites");
    },
    [isFavorite, toggleFavorite]
  );

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="shrink-0 text-xl font-bold tracking-tight">
            🎨 Art Explorer
          </h1>
          <SearchBar onSearch={handleSearch} initialQuery={DEFAULT_QUERY} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <Button
              variant={view === "explore" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("explore")}
            >
              Explore
            </Button>
            <Button
              variant={view === "favorites" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("favorites")}
            >
              <Heart
                className={
                  favoriteCount > 0 ? "fill-red-500 text-red-500" : undefined
                }
              />
              Favorites
              {favoriteCount > 0 && (
                <Badge variant="secondary">{favoriteCount}</Badge>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {view === "favorites"
                ? favoriteCount === 1
                  ? "1 saved artwork"
                  : `${favoriteCount} saved artworks`
                : pagination
                  ? `${pagination.total.toLocaleString()} results`
                  : "Searching..."}
            </p>
            {view === "explore" && isFetching && !isLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Updating...
              </p>
            )}
          </div>
        </div>

        {view === "explore" ? (
          <>
            <ArtworkGrid
              artworks={artworks}
              isLoading={isLoading}
              favoriteIds={favoriteIds}
              onArtworkClick={setSelectedArtworkId}
              onToggleFavorite={handleToggleFavorite}
            />

            {pagination && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <FavoritesView
            favoriteIds={favoriteIds}
            onArtworkClick={setSelectedArtworkId}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      <ArtworkDetail
        artworkId={selectedArtworkId}
        isFavorite={
          selectedArtworkId !== null && isFavorite(selectedArtworkId)
        }
        onClose={() => setSelectedArtworkId(null)}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

export default App;
