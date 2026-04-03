# Random Artwork Discovery

A "Surprise Me" feature that shows a random artwork from the collection, like a museum serendipity experience.

## Overview

Add a "Surprise Me" button that fetches a random artwork and displays it in a featured, full-width presentation. Great for discovering artworks you'd never search for.

## API Endpoints

- **Random page approach:** `GET /artworks/search?query[term][is_public_domain]=true&limit=1&page={random}&fields=...`
  - Pick a random page number between 1 and the total pages
  - Filter to artworks that have images: add `query[exists][field]=image_id`
- **Alternative — random from ID range:** The artwork IDs range roughly from 1 to 300,000. Pick a random ID and try fetching it, falling back to another if it doesn't exist

## Implementation Details

- Add a "Surprise Me" button in the header or as a floating action
- When clicked, pick a random page from the collection and fetch 1 artwork
- Display the artwork in a hero/spotlight layout: large image, title, artist, and full description
- Add a "Next" button to get another random artwork without going back
- Keep a history of previously shown artworks so the user can go back
- Filter to only public domain artworks with images for best results

## Suggested shadcn/ui Components

- **Button** — "Surprise Me" trigger with a Shuffle/Dice icon
- **Card** — large spotlight card for the featured artwork
- **Skeleton** — loading state for the spotlight view
- **Carousel** — swipe through random artworks (if keeping history)
- **Sonner (Toast)** — fun messages like "Discovering art from 1884..."

## Bonus Ideas

- Add a daily art feature that shows a consistent artwork for the day (seed random by date)
- Include a "Share this artwork" button that generates a link
- Add trivia or fun facts about the artwork period or medium
