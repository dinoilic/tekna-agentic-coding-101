# Tekna Agentic Coding 101

This repository contains the app used in the Tekna Agentic Coding 101 workshop.

## Tech stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite](https://vite.dev/) | Build tool and dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible UI components (built on Radix) |
| [TanStack Query](https://tanstack.com/query) | Data fetching and server state |

## Prerequisites

Before you start, make sure you have:

- `git`
- `Node.js` `20.19.0` or newer, or `22.12.0` or newer
- `npm` (included with Node.js)

You can verify your versions with:

```bash
node --version
npm --version
git --version
```

## Clone the repository

Clone the repo and move into the project folder:

```bash
git clone https://github.com/dinoilic/tekna-agentic-coding-101.git
cd tekna-agentic-coding-101
```

If you use SSH with GitHub, you can clone with:

```bash
git clone git@github.com:dinoilic/tekna-agentic-coding-101.git
cd tekna-agentic-coding-101
```

## Install dependencies

Install the project dependencies:

```bash
npm install
```

## Run the app

Start the local development server:

```bash
npm run dev
```

Vite will print a local URL in the terminal, usually:

```text
http://localhost:5173
```

Open that URL in your browser to use the app.

## Project structure

```text
src/
├── components/
│   └── ui/          # shadcn/ui components (Button, etc.)
├── lib/
│   └── utils.ts     # Utility functions (cn helper for class merging)
├── App.tsx          # Main app component
├── main.tsx         # Entry point with QueryClientProvider
└── index.css        # Tailwind CSS + shadcn theme
```

Imports use the `@/` alias, so you can write `import { Button } from "@/components/ui/button"` from anywhere.

## Adding UI components

This project uses [shadcn/ui](https://ui.shadcn.com/) for ready-made components. To add a new component:

```bash
npx shadcn@latest add card
```

Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

## Other useful commands

Lint the codebase:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```
