import { type Artwork, getImageUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface ArtworkCardProps {
  artwork: Artwork;
  isFavorite: boolean;
  onClick: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export function ArtworkCard({
  artwork,
  isFavorite,
  onClick,
  onToggleFavorite,
}: ArtworkCardProps) {
  const hasImage = artwork.image_id !== null;

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-muted transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
      onClick={() => onClick(artwork.id)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {hasImage ? (
          <img
            src={getImageUrl(artwork.image_id!, 600)}
            alt={artwork.thumbnail?.alt_text ?? artwork.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}

        {/* Favorite toggle at top-left */}
        <button
          type="button"
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={isFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(artwork.id);
          }}
          className="absolute left-3 top-3 z-10 rounded-full bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* Badge at top */}
        <div className="absolute inset-x-0 top-0 flex justify-end p-3">
          <Badge className="border-white/20 bg-black/40 text-white backdrop-blur-md text-xs">
            {artwork.artwork_type_title}
          </Badge>
        </div>

        {/* Gradient overlay + text at bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-16">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-white drop-shadow-sm">
            {artwork.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/75">
            {artwork.artist_display}
          </p>
          {artwork.date_display && (
            <p className="mt-1 text-xs text-white/55">
              {artwork.date_display}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
