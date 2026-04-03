# Hidden Gems — Undiscovered Artworks

Surface rarely viewed artworks from the collection using the `has_not_been_viewed_much` flag.

## Overview

The API has a boolean field `has_not_been_viewed_much` that flags artworks that haven't received much attention. Build a "Hidden Gems" section that showcases these lesser-known works, giving users a way to discover art beyond the famous pieces.

## API Endpoints

- **Search for hidden gems:** `POST /artworks/search` with Elasticsearch query

```json
POST /artworks/search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "has_not_been_viewed_much": true } },
        { "exists": { "field": "image_id" } }
      ]
    }
  },
  "fields": ["id", "title", "artist_display", "date_display", "image_id", "thumbnail", "artwork_type_title", "department_title"],
  "limit": 12,
  "sort": { "_score": "desc" }
}
```

- **Combine with text search:** Add a `q` parameter to find hidden gems matching a topic

```json
POST /artworks/search
{
  "q": "landscape",
  "query": {
    "bool": {
      "must": [
        { "term": { "has_not_been_viewed_much": true } },
        { "exists": { "field": "image_id" } }
      ]
    }
  },
  "fields": ["id", "title", "artist_display", "date_display", "image_id", "thumbnail", "artwork_type_title"],
  "limit": 12
}
```

## Implementation Details

- Add a "Hidden Gems" tab or toggle alongside the main search
- When active, modify the search query to include the `has_not_been_viewed_much` filter
- Add a visual indicator (e.g., a gem icon badge) on cards for hidden gem artworks
- Optionally combine with the search bar so users can find hidden gems about a specific topic
- Consider a dedicated "Hidden Gems" page with random sampling for each visit

## Suggested shadcn/ui Components

- **Tabs** — switch between "All" and "Hidden Gems" modes
- **Badge** — gem icon indicator on qualifying artworks
- **Toggle** — quick filter toggle in the toolbar
- **Card** — featured hidden gem highlight card
- **Tooltip** — explain what "Hidden Gem" means

## Bonus Ideas

- Create a "Hidden Gem of the Day" spotlight feature
- Track how many hidden gems the user has discovered (gamification)
- Show a comparison: "This artwork has been viewed X times less than the most popular works"
