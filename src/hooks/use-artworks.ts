import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchArtworks, getArtworkDetail, getArtworksByIds } from "@/lib/api";

export function useSearchArtworks(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["artworks", "search", query, page],
    queryFn: () => searchArtworks(query, page),
    placeholderData: keepPreviousData,
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArtworkDetail(id: number | null) {
  return useQuery({
    queryKey: ["artworks", "detail", id],
    queryFn: () => getArtworkDetail(id!),
    enabled: id !== null,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFavoriteArtworks(ids: number[]) {
  return useQuery({
    queryKey: ["artworks", "favorites", [...ids].sort((a, b) => a - b)],
    queryFn: () => getArtworksByIds(ids),
    enabled: ids.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}
