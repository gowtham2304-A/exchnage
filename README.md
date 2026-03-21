# DivineBridge

DivineBridge is a student-focused clothing rental platform built with Next.js App Router, Prisma, and NextAuth.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Prisma + PostgreSQL
- NextAuth credentials auth
- Tailwind CSS 4

## Local Setup

1. Install dependencies:

	npm install

2. Create environment variables:

	Copy `.env.example` to `.env` and fill all values.

3. Generate Prisma client and run migration:

	npm run prisma:generate
	npm run prisma:migrate

4. Start development server:

	npm run dev

## Security Features Implemented

- Password hashing with bcrypt (12 rounds)
- Server-side input validation with zod
- Registration endpoint rate limiting by client IP
- Security response headers via middleware:
  - X-Content-Type-Options
  - X-Frame-Options
  - Referrer-Policy
  - Permissions-Policy
  - Cross-Origin-Opener-Policy
  - Cross-Origin-Resource-Policy
  - Strict-Transport-Security (production only)
- NextAuth secret-based session protection

## Security Checks

Run lint:

npm run lint

Run dependency audit:

npm audit

## Important Notes

- Use a strong `NEXTAUTH_SECRET` (minimum 32 random bytes).
- Set `DATABASE_URL` to a managed PostgreSQL instance in production.
- Enable HTTPS in production to benefit from secure cookie transport and HSTS.
