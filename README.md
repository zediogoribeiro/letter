# Letter

An editorial publishing platform — a magazine-style blog with a public reading experience, a rich-text article editor for admins, and reader accounts with a "read later" list.

Built with [TanStack Start](https://tanstack.com/start) (React 19, SSR), [Drizzle ORM](https://orm.drizzle.team/) on [Neon Postgres](https://neon.com/), [Better Auth](https://www.better-auth.com/), [Tiptap](https://tiptap.dev/), and [Cloudflare R2](https://developers.cloudflare.com/r2/) for image storage.

## Features

### Public

- **Home page** with a hero section (the featured article, falling back to the most recent published one), a cursor-paginated "latest articles" feed, and a sidebar with trending articles, explore-by-topic links, and a newsletter card.
- **Category pages** (`/:category`) for the five fixed topics: Marketing, Design, Engineering, Product, and Culture.
- **Article pages** (`/articles/:slug`) rendering Tiptap JSON content server-side, with author info, category badge, and estimated read time.
- **Light/dark theme** toggle.

### Readers (authenticated users)

- **Sign up / log in** with email & password or Google OAuth.
- **Read later** — bookmark articles from anywhere in the app and revisit them at `/read-later`.
- **Dashboard** (`/dashboard`) with account management: name, avatar upload.

### Admins

- **Article editor** (`/article-editor`) — a Tiptap rich-text editor (headings, marks, highlight, text alignment) with cover image upload, category, description, and slug management. Slugs are auto-generated from the title and de-duplicated (`my-post`, `my-post-2`, …).
- **Articles tab** in the dashboard — list all articles, publish/unpublish (draft ↔ published), delete, and mark one article as *featured* (enforced at the DB level: featuring an article un-features every other in a single statement).
- Admin role is assigned automatically at sign-up when the email matches `ADMIN_EMAIL_DOMAIN` (e.g. `@company.com`) or equals `DEVELOPER_EMAIL`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) — React 19 with SSR, file-based routing, and type-safe server functions |
| Server runtime | [Nitro](https://nitro.build/) (Vite plugin), deployed to Vercel |
| Data fetching | [TanStack Query](https://tanstack.com/query) with SSR hydration (`@tanstack/react-router-ssr-query`) |
| Database | [Neon](https://neon.com/) serverless Postgres via [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [Better Auth](https://www.better-auth.com/) — email/password + Google OAuth, admin plugin, Drizzle adapter |
| Rich text | [Tiptap](https://tiptap.dev/) (StarterKit, Highlight, TextAlign) — content stored as JSON in Postgres `jsonb` |
| File storage | Cloudflare R2 via the S3 SDK — presigned PUT URLs, uploads go straight from the browser to R2 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) primitives, [cva](https://cva.style/), [motion](https://motion.dev/) |
| Forms & validation | [react-hook-form](https://react-hook-form.com/) + [Zod v4](https://zod.dev/) (also validates every server function) |
| Tooling | [Biome](https://biomejs.dev/) (lint + format), [Vitest](https://vitest.dev/) + Testing Library, TypeScript |

## Project structure

```
db/
  schema.ts               # Drizzle schema: user, session, account, verification,
                          # articles, read_later (+ relations)
  drizzle.ts              # Neon client + Drizzle instance
drizzle/                  # SQL migrations (drizzle-kit)
src/
  routes/                 # File-based routes (TanStack Router)
    index.tsx             # Home
    $category.tsx         # Category listing
    articles/$articleId.tsx  # Public article page (by slug)
    login.tsx, signup.tsx
    api/auth/$.ts         # Better Auth catch-all handler
    (authorized)/         # Layout guard: redirects to /login without a session
      (user)/dashboard.tsx
      (user)/read-later.tsx
      (admin)/            # Layout guard: redirects to /unauthorized unless role=admin
        article-editor/   # New article + edit-by-slug
  lib/
    articles.ts           # Server functions: CRUD, feed pagination, hero, featured
    read-later.ts         # Server functions: toggle + list bookmarks
    uploads.ts            # Presigned R2 upload URLs
    auth.ts, auth-client.ts, middleware.ts  # Better Auth config + requireAuth/requireAdmin
    categories.ts         # The fixed category list
  components/             # Feature components + ui/ primitives + rich-text/ editor
  styles/                 # Tailwind v4 theme + utilities
```

### How data flows

All reads and writes go through **TanStack Start server functions** (`createServerFn`) in `src/lib/`, each validated with Zod and wrapped in `queryOptions` helpers so routes can prefetch in `beforeLoad`/`loader` and components consume them with `useQuery`. Mutations that require privileges call `requireAuth()` / `requireAdmin()` first — authorization is enforced on the server, with the route-level guards in `(authorized)/` and `(admin)/` only handling redirects.

Image uploads never touch the server: the client asks `createUploadUrlFn` for a presigned R2 PUT URL (type/size validated: JPEG/PNG/WebP/GIF, max 8 MB), uploads directly, and stores the resulting public URL.

## Getting started

### Prerequisites

- Node.js 24 (see `.tool-versions`)
- A [Neon](https://neon.com/) Postgres database
- A Google OAuth client (for social login)
- A Cloudflare R2 bucket with a public URL

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and fill it in:

   | Variable | Description |
   |---|---|
   | `BETTER_AUTH_URL` | Base URL of the app (`http://localhost:3000` in dev) |
   | `BETTER_AUTH_SECRET` | Secret for Better Auth (generate with `openssl rand -base64 32`) |
   | `DATABASE_URL` | Neon Postgres connection string |
   | `ADMIN_EMAIL_DOMAIN` | Email domain granted admin on sign-up (include the `@`, e.g. `@company.com`) |
   | `DEVELOPER_EMAIL` | Single email granted admin on sign-up |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
   | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Cloudflare R2 credentials and the bucket's public base URL |

3. **Run migrations**

   ```bash
   npx drizzle-kit migrate
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

To get an admin account locally, sign up with an email matching `ADMIN_EMAIL_DOMAIN` or `DEVELOPER_EMAIL`, then create articles at `/article-editor`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build (Vite + Nitro) |
| `npm run preview` | Preview the production build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` / `npm run format` / `npm run check` | Biome lint / format / both |
| `npm run generate-routes` | Regenerate the TanStack Router route tree |
| `npx drizzle-kit generate` | Generate a migration from schema changes |
| `npx drizzle-kit migrate` | Apply pending migrations |

## Database schema

- **`user`, `session`, `account`, `verification`** — Better Auth tables (with the admin plugin's `role`, `banned`, `impersonatedBy` fields).
- **`articles`** — `title`, unique `slug`, `category`, `description`, `coverImage`, Tiptap `content` (`jsonb`), `status` (`draft` | `published`), `featured` flag, `authorId` → `user`.
- **`read_later`** — join table (`userId`, `articleId`) with a composite primary key; cascade-deletes with both user and article.

## Deployment

The app builds with the Nitro Vite plugin and deploys to Vercel. Set all the environment variables from `.env.example` in the Vercel project (with `BETTER_AUTH_URL` pointing at the production URL) and make sure the Google OAuth client lists the production callback URL (`<BETTER_AUTH_URL>/api/auth/callback/google`).
