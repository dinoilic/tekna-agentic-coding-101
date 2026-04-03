# Favorites Collection

Save artworks to a personal favorites list using the browser's localStorage.

## Overview

Add a heart/bookmark button to each artwork card and the detail dialog. When clicked, the artwork ID is saved to localStorage. A dedicated "Favorites" view shows all saved artworks, fetched from the API by their IDs.

## API Endpoints

- **Batch fetch by IDs:** `GET /artworks?ids=12345,67890&fields=id,title,artist_display,date_display,image_id,thumbnail,artwork_type_title`
- The API supports fetching multiple artworks by comma-separated IDs in a single request

## Implementation Details

- Store an array of artwork IDs in `localStorage` under a key like `"favorites"`
- Create a custom hook `useFavorites()` that manages the favorites state and syncs with localStorage
- Add a toggle button (heart icon) to `ArtworkCard` and `ArtworkDetail`
- Create a `FavoritesPage` component that fetches and displays saved artworks
- Add a tab or navigation toggle between "Search" and "Favorites" views
- Consider using `@tanstack/react-query` to cache the batch fetch

## Suggested shadcn/ui Components

- **Toggle** — for the favorite/unfavorite heart button
- **Tabs** — to switch between "Search" and "Favorites" views
- **Tooltip** — to show "Add to favorites" on hover
- **Sonner (Toast)** — to confirm "Added to favorites" / "Removed from favorites"

## Bonus Ideas

- Export favorites as a shareable JSON or URL with encoded IDs
- Drag-and-drop reordering of favorites
- Add personal notes to each saved artwork
