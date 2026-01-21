# Food Ordering Web App - Tech Stack

This document lists the complete tech stack for the Food Ordering Web App with direct links to official libraries or documentation for easy reference.

## Frontend

- [Next.js](https://nextjs.org/) (Framework + SSR/SSG + Routing)
- [TailwindCSS](https://tailwindcss.com/) + [ShadCN UI](https://shadcn.com/) (Styling & Components)
- [Zustand](https://zustand-demo.pmnd.rs/) (State Management)
- [React-Hook-Form](https://react-hook-form.com/) (Forms Handling + Validation)
- [Zod](https://zod.dev/) (Form & API Validation)
- [React Query](https://tanstack.com/query/latest) (API Caching & Data Fetching)
- In-memory cache (Temporary Data Storage)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (Component Testing)
- [Vitest](https://vitest.dev/) (Unit & Integration Testing)
- [Cypress](https://www.cypress.io/) (End-to-End Testing)
- ShadCN Toast (Notifications)

## Backend

- [NestJS](https://nestjs.com/) (Framework & API Structure)
- [PostgreSQL](https://www.postgresql.org/) (Relational Database)
- [Prisma](https://www.prisma.io/) (ORM with Type Safety)
- JWT + [Passport.js](http://www.passportjs.org/) (Authentication / Authorization)
- SSE (Real-time Order Updates)
- [Stripe](https://stripe.com/) (Payments Integration + Webhooks)
- [Multer](https://github.com/expressjs/multer) (File/Image Upload Handling)
- [Nodemailer](https://nodemailer.com/about/) (Email / Notifications)
- [Helmet](https://helmetjs.github.io/) (Security Headers)
- Other security middlewares (CORS, Rate Limiting, etc.)
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/visionmedia/supertest) (Backend Testing)

## DevOps / Deployment

- Environment Variables & Config (dotenv / NestJS Config Module)
- CI/CD (GitHub Actions)
- Frontend Hosting (Vercel / Netlify)
- Backend Hosting (Render / Railway / Fly.io)
- Database Hosting (Supabase / Railway / Render)
- Logging & Monitoring (Winston / Pino + Sentry / Logflare)
- Podman / Docker (Containerization)

## Optional / Future Enhancements

- [ ] Redis (Caching / Session Management)
- [ ] Queue System (Bull / Bee-Queue for Async Jobs)
- [ ] Optional Customer Authentication (Save past orders, favorites, reviews)
- [ ] Terraform / Pulumi (Infra as Code)
