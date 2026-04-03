import { useState, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { ArtworkGrid } from "@/components/artwork-grid";
import { ArtworkDetail } from "@/components/artwork-detail";
import { Pagination } from "@/components/pagination";
import { useSearchArtworks } from "@/hooks/use-artworks";
import type { Artwork } from "@/lib/api";

const DEFAULT_QUERY = "impressionism";

function App() {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY);
  const [page, setPage] = useState(1);
  const [selectedArtworkId, setSelectedArtworkId] = useState<number | null>(
    null
  );

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
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pagination
              ? `${pagination.total.toLocaleString()} results`
              : "Searching..."}
          </p>
          {isFetching && !isLoading && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Updating...
            </p>
          )}
        </div>

        <ArtworkGrid
          artworks={artworks}
          isLoading={isLoading}
          onArtworkClick={setSelectedArtworkId}
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
      </main>

      <ArtworkDetail
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
      />
    </div>
  );
}

export default App;
