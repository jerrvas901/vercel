# Vercel Portfolio DB

Next.js portfolio with MongoDB-backed authentication (`/api/auth/*`) and a protected dashboard.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set values:

- `MONGODB_URI`
- `MONGODB_DB` (optional, defaults to `portfolio`)

3. Run:

```bash
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. In Vercel Project Settings > Environment Variables, add:

- `MONGODB_URI`
- `MONGODB_DB`

4. Deploy.

## Build Checks

```bash
npm run lint
npm run build
```
