# Shareable Artwork Links

Generate shareable URLs for individual artworks so users can link directly to an artwork detail view.

## Overview

Add URL-based routing so that each artwork has a unique shareable link. When someone opens the link, the app loads directly into the detail view for that artwork.

## Implementation Details

- Use URL search parameters or hash-based routing to encode the artwork ID
  - Simple approach: `?artwork=12345` as a query parameter
  - Alternative: use `react-router` with routes like `/artwork/:id`
- On app load, check for an artwork parameter in the URL
- If present, automatically open the artwork detail dialog/view
- Add a "Copy Link" button to the detail dialog that copies the shareable URL to clipboard
- After closing the detail view, clear the URL parameter

## Without a Router (simplest approach)

```tsx
// Read artwork ID from URL on mount
const params = new URLSearchParams(window.location.search);
const artworkParam = params.get("artwork");
if (artworkParam) {
  setSelectedArtworkId(Number(artworkParam));
}

// Update URL when selecting an artwork
function selectArtwork(id: number) {
  setSelectedArtworkId(id);
  const url = new URL(window.location.href);
  url.searchParams.set("artwork", String(id));
  window.history.pushState({}, "", url);
}
```

## With React Router

```bash
npm install react-router
```

Define routes for the main gallery and artwork detail, using URL parameters.

## Suggested shadcn/ui Components

- **Button** — "Copy Link" and "Share" buttons
- **Sonner (Toast)** — "Link copied to clipboard!" confirmation
- **Tooltip** — hover text for the share button
- **Dropdown Menu** — share options (Copy Link, Open on Art Institute website)

## Bonus Ideas

- Generate Open Graph meta tags for social media previews
- Add a "View on Art Institute website" link using `http://www.artic.edu/artworks/{id}`
- Support sharing search queries too (e.g., `?q=monet&page=2`)
