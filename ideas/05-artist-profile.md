# Artist Profile Page

Show a dedicated artist page with biography and all their artworks in the collection.

## Overview

When viewing an artwork's detail, the artist name becomes a clickable link that opens an artist profile view. This page shows the artist's biography and a grid of all their artworks in the Art Institute's collection.

## API Endpoints

- **Artist detail:** `GET /artists/{id}?fields=id,title,birth_date,death_date,description`
- **Artworks by artist (search):** `POST /artworks/search` with a `term` query on `artist_id`

### Example: Fetch Artworks by Artist

```json
POST /artworks/search
{
  "query": {
    "term": { "artist_id": 35809 }
  },
  "fields": ["id", "title", "date_display", "image_id", "thumbnail", "artwork_type_title"],
  "limit": 24
}
```

- **Artist search:** `GET /artists/search?q={name}&fields=id,title,birth_date,death_date`

## Implementation Details

- Add `artist_id` to the fields fetched in the artwork detail response
- Make the artist name in `ArtworkDetail` a clickable element
- Create an `ArtistProfile` component that fetches artist details and their artworks
- Display the artist's name, life dates (birth–death), and HTML biography
- Below the bio, show a grid of the artist's artworks using the existing `ArtworkGrid` component
- Use TanStack Query to cache artist data and their artwork lists
- Consider using a sheet or full page view for the artist profile

## Suggested shadcn/ui Components

- **Sheet** — slide-in panel for the artist profile
- **Avatar** — placeholder for artist (using initials or a generic icon)
- **Separator** — between biography and artworks grid
- **Badge** — show life dates, artwork count
- **Skeleton** — loading state for the profile

## Bonus Ideas

- Add an artist search feature to find artists directly
- Show a timeline of the artist's works sorted by date
- Link related artists (same department, same era)
