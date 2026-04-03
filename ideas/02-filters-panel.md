# Artwork Type & Department Filters

Add sidebar or dropdown filters to narrow search results by artwork type, department, or other classification fields.

## Overview

The Art Institute API supports Elasticsearch queries that can filter artworks by fields like `artwork_type_title`, `department_title`, `style_titles`, and `classification_titles`. Add a filter panel that lets users refine their search beyond just text.

## API Endpoints

- **Artwork types list:** `GET /artwork-types?limit=50`
- **Departments list:** `GET /departments?limit=50`
- **Filtered search (POST):** `POST /artworks/search` with an Elasticsearch bool query combining text search and term filters

### Example POST Body

```json
{
  "q": "landscape",
  "query": {
    "bool": {
      "must": [
        { "term": { "artwork_type_title.keyword": "Painting" } },
        { "term": { "department_title.keyword": "Modern Art" } }
      ]
    }
  },
  "fields": ["id", "title", "artist_display", "date_display", "image_id", "thumbnail", "artwork_type_title", "department_title"],
  "limit": 12
}
```

## Implementation Details

- Fetch artwork types and departments on app load and cache them
- Add a filter panel (sidebar on desktop, sheet on mobile) with checkboxes or comboboxes for each filter category
- Modify the search query hook to accept filter parameters
- Switch from GET to POST requests when filters are active
- Show active filters as removable badges above the results grid
- Add a "Clear all filters" button

## Suggested shadcn/ui Components

- **Sheet** — slide-out filter panel on mobile
- **Checkbox** — for multi-select filters
- **Combobox (Popover + Command)** — for searchable filter dropdowns
- **Badge** — to display active filters as removable pills
- **Accordion** — to group filter categories (Type, Department, Style)
- **Separator** — between filter groups
