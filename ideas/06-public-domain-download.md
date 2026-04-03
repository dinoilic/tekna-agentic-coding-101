# Public Domain Image Download

Allow users to download high-resolution images of public domain artworks.

## Overview

Many artworks in the Art Institute collection are in the public domain. For these works, higher resolution images are available through the IIIF Image API. Add a download button that fetches the full-resolution image and saves it locally.

## API Endpoints

- **Check public domain status:** Include `is_public_domain` in the artwork fields
- **Standard image (843px):** `https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg`
- **High-res image (1686px, public domain only):** `https://www.artic.edu/iiif/2/{image_id}/full/1686,/0/default.jpg`
- **IIIF info:** `https://www.artic.edu/iiif/2/{image_id}/info.json` — returns full image dimensions and available sizes

## Implementation Details

- Add `is_public_domain` to the fields fetched for artwork detail
- In the detail dialog, show a "Download" button for public domain artworks
- For non-public domain works, show a disabled button with a tooltip explaining copyright
- Use the `fetch` API to download the image as a blob, then create a temporary `<a>` element with `download` attribute to trigger the save
- Offer size options: Medium (843px), Large (1686px)

## Key Code Pattern

```tsx
async function downloadImage(imageId: string, title: string) {
  const url = `https://www.artic.edu/iiif/2/${imageId}/full/1686,/0/default.jpg`;
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.jpg`;
  link.click();
  URL.revokeObjectURL(link.href);
}
```

## Suggested shadcn/ui Components

- **Button** — download trigger with a Download icon
- **Dropdown Menu** — size selection (Medium / Large)
- **Tooltip** — explain why download is unavailable for copyrighted works
- **Sonner (Toast)** — show download progress/completion notification
- **Badge** — "Public Domain" indicator on cards and detail view

## Bonus Ideas

- Show the full image dimensions from the IIIF info endpoint
- Add a "Set as wallpaper" suggestion with recommended crop dimensions
- Create a gallery of only public domain works for easy browsing
