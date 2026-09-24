# MINDH Laboratory Frontend

A focused Next.js frontend for the MINDH Laboratory public website.

## Development

```bash
npm install
npm run dev
```

## Structure

- `src/app`: public routes and SEO metadata
- `src/components`: shared navigation, footer, and section primitives
- `src/lib/content.ts`: navigation and editorial content
- `src/lib/firestore.ts`: boundary for future Firestore reads

The project intentionally contains no admin portal, server filesystem, fabricated seed records, or API implementation. Connect verified Firestore collections through `src/lib/firestore.ts` when the data model is ready.
