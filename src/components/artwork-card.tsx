import { type Artwork, getImageUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (id: number) => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
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
