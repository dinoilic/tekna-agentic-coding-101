import {
  Dialog,
  DialogContent,
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
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0">
        {isLoading ? (
          <ArtworkDetailSkeleton />
        ) : artwork ? (
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">
            {/* Left: Image */}
            <div className="relative bg-muted">
              {artwork.image_id ? (
                <img
                  src={getImageUrl(artwork.image_id, 843)}
                  alt={artwork.thumbnail?.alt_text ?? artwork.title}
                  className="h-full max-h-[85vh] w-full object-contain"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex max-h-[85vh] flex-col overflow-y-auto p-6">
              {/* Visually hidden for a11y, actual title is shown below */}
              <DialogTitle className="sr-only">{artwork.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {artwork.artist_display}
              </DialogDescription>

              <div className="space-y-1">
                <h2 className="text-xl font-semibold leading-tight">
                  {artwork.title}
                </h2>
                <p className="text-base text-muted-foreground">
                  {artwork.artist_display}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
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
                  <Separator className="my-4" />
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: artwork.description }}
                  />
                </>
              )}

              <Separator className="my-4" />

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
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
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ArtworkDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">
      <Skeleton className="aspect-square rounded-none md:aspect-auto md:min-h-[400px]" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
