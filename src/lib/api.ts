const API_BASE = "https://api.artic.edu/api/v1";
const IIIF_BASE = "https://www.artic.edu/iiif/2";

// Fields we request from the API to keep payloads small
const SEARCH_FIELDS = [
  "id",
  "title",
  "artist_display",
  "date_display",
  "image_id",
  "thumbnail",
  "artwork_type_title",
  "department_title",
].join(",");

const DETAIL_FIELDS = [
  "id",
  "title",
  "artist_display",
  "date_display",
  "image_id",
  "thumbnail",
  "artwork_type_title",
  "department_title",
  "medium_display",
  "dimensions",
  "credit_line",
  "place_of_origin",
  "description",
].join(",");

export interface ArtworkThumbnail {
  lqip: string;
  width: number;
  height: number;
  alt_text: string;
}

export interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  date_display: string;
  image_id: string | null;
  thumbnail: ArtworkThumbnail | null;
  artwork_type_title: string;
  department_title: string;
}

export interface ArtworkDetail extends Artwork {
  medium_display: string;
  dimensions: string;
  credit_line: string;
  place_of_origin: string;
  description: string | null;
}

export interface ArtworkSearchResponse {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
  data: Artwork[];
}

export interface ArtworkDetailResponse {
  data: ArtworkDetail;
}

export function getImageUrl(
  imageId: string,
  width: 200 | 400 | 600 | 843 = 843
): string {
  return `${IIIF_BASE}/${imageId}/full/${width},/0/default.jpg`;
}

export async function searchArtworks(
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<ArtworkSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
    fields: SEARCH_FIELDS,
  });

  const res = await fetch(`${API_BASE}/artworks/search?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getArtworkDetail(
  id: number
): Promise<ArtworkDetailResponse> {
  const params = new URLSearchParams({ fields: DETAIL_FIELDS });
  const res = await fetch(`${API_BASE}/artworks/${id}?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
