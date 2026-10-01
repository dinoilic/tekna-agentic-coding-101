import { Heart } from "lucide-react";
import { ArtworkGrid } from "@/components/artwork-grid";
import { useFavoriteArtworks } from "@/hooks/use-artworks";
import type { Artwork } from "@/lib/api";

interface FavoritesViewProps {
  favoriteIds: number[];
  onArtworkClick: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export function FavoritesView({
  favoriteIds,
  onArtworkClick,
  onToggleFavorite,
}: FavoritesViewProps) {
  const { data, isLoading, isError } = useFavoriteArtworks(favoriteIds);

  if (favoriteIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Heart className="h-6 w-6 text-muted-foreground" />
        </span>
        <p className="mt-4 text-lg text-muted-foreground">No favorites yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap the heart on any artwork to save it here
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">
          Could not load favorites
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please check your connection and try again
        </p>
      </div>
    );
  }

  // The batch endpoint doesn't guarantee order — restore saved (newest-first) order
  const byId = new Map((data?.data ?? []).map((a) => [a.id, a]));
  const artworks = favoriteIds
    .map((id) => byId.get(id))
    .filter((a): a is Artwork => a !== undefined);

  return (
    <ArtworkGrid
      artworks={artworks}
      isLoading={isLoading}
      favoriteIds={favoriteIds}
      onArtworkClick={onArtworkClick}
      onToggleFavorite={onToggleFavorite}
    />
  );
}
