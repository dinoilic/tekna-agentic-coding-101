import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "art-explorer:favorites";

function readStoredFavorites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (id): id is number => typeof id === "number" && Number.isInteger(id)
    );
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] =
    useState<number[]>(readStoredFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Storage unavailable (e.g. private mode) — favorites just won't persist
    }
  }, [favoriteIds]);

  // Keep favorites in sync across open tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setFavoriteIds(readStoredFavorites());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [id, ...prev]
    );
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return {
    favoriteIds,
    favoriteCount: favoriteIds.length,
    toggleFavorite,
    isFavorite,
  };
}
