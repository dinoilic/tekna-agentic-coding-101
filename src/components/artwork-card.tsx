import { type Artwork, getImageUrl } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (id: number) => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const hasImage = artwork.image_id !== null;

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
      onClick={() => onClick(artwork.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hasImage ? (
          <img
            src={getImageUrl(artwork.image_id!, 400)}
            alt={artwork.thumbnail?.alt_text ?? artwork.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}
      </div>
      <CardContent className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold leading-tight">
          {artwork.title}
        </h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {artwork.artist_display}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {artwork.artwork_type_title}
          </Badge>
          {artwork.date_display && (
            <span className="text-xs text-muted-foreground">
              {artwork.date_display}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
