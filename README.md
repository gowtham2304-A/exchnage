# DivineBridge

DivineBridge is a student-focused clothing rental platform where users can list outfits, rent from other students, and manage bookings with safer defaults.

## What This Project Includes

- Next.js 16 App Router application
- Prisma + PostgreSQL data layer
- NextAuth credentials-based authentication
- Registration API with validation, hashing, and rate limiting
- Security headers via proxy-level middleware
- Landing page and legal pages (`/terms`, `/policy`)

## Tech Stack

- Next.js 16.2.1
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 6.19.2
- NextAuth 4
- Zod
- bcryptjs

## Project Structure

```text
app/
  api/auth/[...nextauth]/route.ts
  api/auth/register/route.ts
  page.tsx
  terms/page.tsx
  policy/page.tsx
lib/
  auth.ts
  prisma.ts
  rate-limit.ts
prisma/
  schema.prisma
proxy.ts
```

## Environment Variables

Copy `.env.example` to `.env` and provide production-safe values.

Required values:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`

Generate a strong auth secret:

```bash
openssl rand -base64 32
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npm run prisma:generate
```

3. Run database migration:

```bash
npm run prisma:migrate
```

4. Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## NPM Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run start` - start built app
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma migrations
- `npm run prisma:studio` - open Prisma Studio

## Security Baseline

- Password hashing with bcrypt (12 rounds)
- Input validation with zod
- Rate limiting on registration endpoint
- NextAuth secret-based session security
- Proxy-level security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Resource-Policy: same-origin`
  - `Strict-Transport-Security` in production

## API Endpoints

- `POST /api/auth/register` - register account
- `GET|POST /api/auth/[...nextauth]` - NextAuth handler

## Deployment Checklist

1. Set production environment variables.
2. Run migrations against production database.
3. Ensure HTTPS is enabled.
4. Run:

```bash
npm run lint
npm run build
```

## Repository

GitHub: `https://github.com/gowtham2304-A/exchnage`
