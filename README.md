# Jimdo Clone

A static frontend clone of the Jimdo marketing website, built with Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- Vite
- TypeScript
- Tailwind CSS
- Flowbite
- FlyonUI

## Prerequisites

- Node.js LTS (18 or higher)
- npm

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Type-check with `tsc` and build for production
- `npm run preview` - Preview the production build locally

## Project Structure

```text
.
├── index.html
├── screensizes.md
├── src
│   ├── assets
│   │   ├── fonts
│   │   └── images
│   ├── index.js
│   ├── main.ts
│   └── style.css
├── tsconfig.json
└── vite.config.ts
```

## Notes

- Responsive breakpoints used in this project are documented in [`screensizes.md`](./screensizes.md).
- `src/index.js` is intentionally a JavaScript file used for page interaction behavior.
- This repository currently does not define test scripts in `package.json`.
