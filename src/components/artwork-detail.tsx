import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtworkDetail } from "@/hooks/use-artworks";
import { getImageUrl } from "@/lib/api";

interface ArtworkDetailProps {
  artworkId: number | null;
  onClose: () => void;
}

export function ArtworkDetail({ artworkId, onClose }: ArtworkDetailProps) {
  const { data, isLoading } = useArtworkDetail(artworkId);
  const artwork = data?.data;

  return (
    <Dialog open={artworkId !== null} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {isLoading ? (
          <ArtworkDetailSkeleton />
        ) : artwork ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl leading-tight">
                {artwork.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {artwork.artist_display}
              </DialogDescription>
            </DialogHeader>

            {artwork.image_id && (
              <div className="overflow-hidden rounded-lg bg-muted">
                <img
                  src={getImageUrl(artwork.image_id, 843)}
                  alt={artwork.thumbnail?.alt_text ?? artwork.title}
                  className="w-full object-contain"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge>{artwork.artwork_type_title}</Badge>
              {artwork.department_title && (
                <Badge variant="outline">{artwork.department_title}</Badge>
              )}
              {artwork.date_display && (
                <Badge variant="secondary">{artwork.date_display}</Badge>
              )}
            </div>

            {artwork.description && (
              <>
                <Separator />
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: artwork.description }}
                />
              </>
            )}

            <Separator />

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {artwork.medium_display && (
                <>
                  <dt className="font-medium">Medium</dt>
                  <dd className="text-muted-foreground">
                    {artwork.medium_display}
                  </dd>
                </>
              )}
              {artwork.dimensions && (
                <>
                  <dt className="font-medium">Dimensions</dt>
                  <dd className="text-muted-foreground">
                    {artwork.dimensions}
                  </dd>
                </>
              )}
              {artwork.place_of_origin && (
                <>
                  <dt className="font-medium">Origin</dt>
                  <dd className="text-muted-foreground">
                    {artwork.place_of_origin}
                  </dd>
                </>
              )}
              {artwork.credit_line && (
                <>
                  <dt className="font-medium">Credit</dt>
                  <dd className="text-muted-foreground">
                    {artwork.credit_line}
                  </dd>
                </>
              )}
            </dl>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ArtworkDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
