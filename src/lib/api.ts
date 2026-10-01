const API_BASE = "https://api.artic.edu/api/v1";
const IIIF_PROXY_BASE = "/aic-iiif";

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
  alt_text: string | null;
}

export interface Artwork {
  id: number;
  title: string;
  artist_display: string | null;
  date_display: string | null;
  image_id: string | null;
  thumbnail: ArtworkThumbnail | null;
  artwork_type_title: string | null;
  department_title: string | null;
}

export interface ArtworkDetail extends Artwork {
  medium_display: string | null;
  dimensions: string | null;
  credit_line: string | null;
  place_of_origin: string | null;
  description: string | null;
}

export interface ApiConfig {
  iiif_url: string;
  website_url: string;
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
  config: ApiConfig;
}

export interface ArtworkDetailResponse {
  data: ArtworkDetail;
  config: ApiConfig;
}

export interface ArtworksByIdsResponse {
  data: Artwork[];
  config: ApiConfig;
}

export function getImageUrl(
  imageId: string,
  width: 200 | 400 | 600 | 843 = 843
): string {
  return `${IIIF_PROXY_BASE}/${imageId}/full/${width},/0/default.jpg`;
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

export async function getArtworksByIds(
  ids: number[]
): Promise<ArtworksByIdsResponse> {
  const params = new URLSearchParams({
    ids: ids.join(","),
    limit: String(Math.min(Math.max(ids.length, 1), 100)),
    fields: SEARCH_FIELDS,
  });

  const res = await fetch(`${API_BASE}/artworks?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
