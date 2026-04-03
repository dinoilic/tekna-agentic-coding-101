# Dark Mode Toggle

Add a light/dark mode toggle with system preference detection and persistent user choice.

## Overview

The app already uses shadcn/ui's CSS variable-based theming which supports a `.dark` class on the root element. Add a toggle button that switches between light, dark, and system modes, persisting the choice in localStorage.

## Implementation Details

- Create a `ThemeProvider` context that manages the current theme (`"light"`, `"dark"`, or `"system"`)
- On mount, read the saved preference from `localStorage` or default to `"system"`
- Apply/remove the `dark` class on `document.documentElement` based on the active theme
- When set to `"system"`, use `window.matchMedia("(prefers-color-scheme: dark)")` and listen for changes
- Add a theme toggle button to the app header

## Suggested shadcn/ui Components

- **Dropdown Menu** — for a three-way toggle (Light / Dark / System) with icons
- **Button** — as the trigger showing the current theme icon (Sun, Moon, or Monitor)

## Key Code Pattern

```tsx
// Theme toggle using a dropdown
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="icon">
      <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Bonus Ideas

- Animate the theme transition with CSS transitions on `background-color` and `color`
- Add a subtle animation to the toggle icon when switching
