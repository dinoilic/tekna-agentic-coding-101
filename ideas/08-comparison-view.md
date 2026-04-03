# Artwork Comparison View

Place two artworks side by side to compare their details, styles, and visual characteristics.

## Overview

Add a comparison mode where users can select two artworks and view them next to each other. This is useful for comparing works by the same artist across periods, or contrasting different artistic styles.

## API Endpoints

- **Batch artwork detail:** `GET /artworks?ids=12345,67890&fields=id,title,artist_display,date_display,image_id,thumbnail,artwork_type_title,department_title,medium_display,dimensions,style_titles,subject_titles,place_of_origin`
- Uses the multi-ID batch endpoint for efficiency

## Implementation Details

- Add a "Compare" button/checkbox to each artwork card
- Track up to 2 selected artworks in app state
- When 2 artworks are selected, show a floating "Compare" action bar at the bottom
- The comparison view shows both artworks side by side with their images and metadata
- Highlight differences in a structured layout: artist, date, medium, style, origin
- On mobile, stack the artworks vertically instead of side by side

## Layout Concept

```
┌─────────────────┬─────────────────┐
│   [Artwork A]   │   [Artwork B]   │
│                 │                 │
│  Title: ...     │  Title: ...     │
│  Artist: ...    │  Artist: ...    │
│  Date: ...      │  Date: ...      │
│  Medium: ...    │  Medium: ...    │
│  Style: ...     │  Style: ...     │
│  Origin: ...    │  Origin: ...    │
└─────────────────┴─────────────────┘
```

## Suggested shadcn/ui Components

- **Checkbox** — selection toggle on artwork cards
- **Dialog** or **Sheet** — comparison overlay
- **Table** — structured metadata comparison
- **Badge** — style and classification tags for visual comparison
- **Button** — floating "Compare (2)" action trigger
- **Separator** — between comparison sections

## Bonus Ideas

- Allow comparing more than 2 artworks in a horizontal scroll
- Add a "Similar Artworks" suggestion using shared styles or subjects
- Side-by-side image zoom synchronized across both artworks
