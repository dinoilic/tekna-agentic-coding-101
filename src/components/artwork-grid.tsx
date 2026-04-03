import { type Artwork } from "@/lib/api";
import { ArtworkCard } from "@/components/artwork-card";
import { ArtworkGridSkeleton } from "@/components/artwork-grid-skeleton";

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading: boolean;
  onArtworkClick: (id: number) => void;
}

export function ArtworkGrid({
  artworks,
  isLoading,
  onArtworkClick,
}: ArtworkGridProps) {
  if (isLoading) {
    return <ArtworkGridSkeleton />;
  }

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">No artworks found</p>
        <p className="text-sm text-muted-foreground">
          Try a different search term
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          onClick={onArtworkClick}
        />
      ))}
    </div>
  );
}
