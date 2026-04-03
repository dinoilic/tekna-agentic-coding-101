# Infinite Scroll

Replace the pagination buttons with infinite scroll that automatically loads more artworks as the user scrolls down.

## Overview

Instead of clicking "Next" to see more results, the gallery continuously loads additional artwork cards as the user approaches the bottom of the page. This creates a more fluid browsing experience.

## API Endpoints

- **Same search endpoint:** `GET /artworks/search?q={query}&page={n}&limit=12&fields=...`
- Increment the `page` parameter for each new batch

## Implementation Details

- Use TanStack Query's `useInfiniteQuery` hook instead of the current `useQuery`
- Define a `getNextPageParam` function that returns the next page number based on `pagination.current_page` and `pagination.total_pages`
- Use the `IntersectionObserver` API to detect when a sentinel element at the bottom of the grid becomes visible
- When the sentinel is visible, call `fetchNextPage()` to load the next batch
- Flatten the pages array to render all artworks in a single grid
- Show a loading spinner at the bottom while fetching the next page
- Cap at a reasonable max (e.g., 10 pages) to avoid excessive memory usage

## Key Code Pattern

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["artworks", "search", query],
  queryFn: ({ pageParam }) => searchArtworks(query, pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    const { current_page, total_pages } = lastPage.pagination;
    return current_page < Math.min(total_pages, 10) ? current_page + 1 : undefined;
  },
});

const allArtworks = data?.pages.flatMap((page) => page.data) ?? [];
```

## Suggested shadcn/ui Components

- **Skeleton** — loading indicator rows at the bottom of the grid while fetching
- **Button** — optional "Load More" fallback button for accessibility

## Bonus Ideas

- Add a "Back to top" floating button that appears after scrolling
- Show a progress indicator (e.g., "Showing 36 of 1,200 results")
- Virtualize the grid with `@tanstack/react-virtual` for better performance with many items
