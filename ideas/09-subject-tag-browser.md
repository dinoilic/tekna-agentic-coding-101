# Subject Tag Cloud & Browser

Explore the collection through subject tags — discover artworks by what they depict.

## Overview

Each artwork has a `subject_titles` array describing what the artwork depicts (e.g., "dogs", "landscapes", "women", "flowers", "war"). Build an interactive tag cloud or tag browser that lets users explore the collection by subject matter.

## API Endpoints

- **Aggregate subjects:** Use Elasticsearch aggregations to discover popular subjects

```json
POST /artworks/search
{
  "query": { "exists": { "field": "image_id" } },
  "aggregations": {
    "subjects": {
      "terms": { "field": "subject_titles.keyword", "size": 50 }
    }
  },
  "limit": 0
}
```

- **Filter by subject:** `POST /artworks/search` with a term query

```json
POST /artworks/search
{
  "query": {
    "term": { "subject_titles.keyword": "dogs" }
  },
  "fields": ["id", "title", "artist_display", "date_display", "image_id", "thumbnail", "artwork_type_title", "subject_titles"],
  "limit": 12
}
```

## Implementation Details

- Fetch the top 50 subjects with their artwork counts using aggregations
- Display them as an interactive tag cloud where tag size reflects the number of artworks
- Alternatively, display as a scrollable list of badges/buttons
- Clicking a tag filters the gallery to show artworks with that subject
- Allow selecting multiple tags to find artworks matching all selected subjects (AND logic)
- Show the selected tags as removable filter badges above the grid

## Suggested shadcn/ui Components

- **Badge** — clickable subject tags, sized by popularity
- **Toggle Group** — for multi-select tag filtering
- **Command (Combobox)** — searchable subject picker for the full list
- **Scroll Area** — for the tag list if it grows long
- **Popover** — to show tag details (count, sample artwork) on hover

## Bonus Ideas

- Visualize subjects as a word cloud using a library like `react-wordcloud`
- Show "Related subjects" when browsing a tag (subjects that frequently co-occur)
- Create themed collections by combining subjects (e.g., "Animals in Art" = dogs + cats + birds)
