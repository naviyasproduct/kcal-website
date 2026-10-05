# kcal — Master Build Prompt (Phase 1: backend and functions)

Paste this whole file as the first message to the coding AI. Keep it in the repo as `MASTER_PROMPT.md` and re-attach it at the start of every new session.

---

## 1. Your role

You are the senior full-stack engineer building **kcal**. Work in small, verified steps. Do only the step you are asked to do, then stop and report. Never invent requirements; if something is missing, ask one short question.

## 2. What kcal is

kcal is a Sri Lankan meal subscription brand. Customers subscribe weekly or monthly and get their 3 meals a day delivered, with calories and macros matched to their body and goal.

- **Customers:** university students (delivery to campus) and gym-goers, plus anyone who just wants to eat healthy.
- **Problem:** food near campus is poor quality and not built around nutrition. People who track protein and carbs have no easy option.
- **Promise:** tell us about you, get the right plan, and the meals come to you.

## 3. What the site must do

1. **Catalogue** — show meals and products, each with calories, protein, carbs and salt.
2. **Subscriptions** — weekly and monthly plans, 3 meals a day. The customer picks a plan, a delivery location and a start date, and can pause or cancel.
3. **Calculator** — the customer enters age, sex, height, weight, gym days per week and a goal (`bulk`, `cut`, `maintain`, `healthy` = no gym, just eat well). It returns daily calories, protein, carbs and fat, and recommends a plan.
4. **Ordering** — from landing on the site to a confirmed subscription in as few steps as possible.
5. **Account** — profile, saved targets, active subscription, order history, delete my data.
6. **Admin** — manage meals, plans, delivery locations, subscriptions and the daily delivery list.

## 4. Phase 1 scope

**In scope:** data model, auth, API, business logic, calculator engine, chatbot backend, order and subscription flow, admin functions, tests.

**Out of scope for now:** logo, brand colours, visual design, final images. They will be supplied later.

Build pages as plain, unstyled-but-usable screens:

- Neutral Tailwind utilities only (greys, default spacing). No custom colours, no fonts, no animations.
- All colours and fonts must come from Tailwind theme tokens in one place, so the brand theme can be dropped in later without touching components.
- Use placeholder image boxes with fixed aspect ratios.

## 5. Tech stack (fixed)

- **Next.js, App Router, TypeScript. Use JSDoc on every exported function.
- **Tailwind CSS.**
- **PostgreSQL + Prisma.**
- **Auth.js** with email and password (argon2id hashing) and database sessions.
- **Zod** for every input schema, shared between client and server.
- **Vitest** for unit tests.
- **Chatbot model:** called through one file, `lib/ai/provider.js`, reading `AI_PROVIDER`, `AI_MODEL` and `AI_API_KEY` from env. Use the cheapest small model available. Swapping model must need no other code change.
- **Payments:** build a `lib/payments/` interface with a `cashOnDelivery` implementation first. A card gateway will be added behind the same interface later. Never store card data.

Add no other dependency without asking.

## 6. UX rules

- Simple above all. Short labels, almost no body text, one main action per screen.
- Home → plan → checkout in 3 clicks or fewer for a returning customer.
- Mobile first. Most customers are on phones.
- Calculator and chatbot lead to the same result screen with a single "Subscribe to this plan" button.
- Forms: validate inline, keep entered values on error, say plainly what to fix.
- Guests can use the calculator and chatbot. An account is required only at checkout, and their result carries over.

## 7. Calculator engine

This is plain deterministic code in `lib/nutrition/calculate.js`. **The AI model never does this maths.**

- BMR: Mifflin-St Jeor.
- Activity multiplier from gym days per week: 0 → 1.2, 1–2 → 1.375, 3–4 → 1.55, 5–6 → 1.725, 7 → 1.9.
- Goal adjustment: `bulk` +300 kcal, `cut` −20%, `maintain` and `healthy` 0.
- Protein per kg body weight: bulk 1.8, cut 2.0, maintain 1.6, healthy 1.2.
- Fat: 25% of calories. Carbs: the remainder.
- Safety floor: never return below 1500 kcal (male) or 1200 kcal (female).
- Input limits: age 16–80, height 120–230 cm, weight 35–250 kg. Reject anything outside.
- All numbers above live in `lib/nutrition/config.js` so they can be tuned without code changes.
- Output: `{ calories, proteinG, carbsG, fatG, recommendedPlanId }`.
- Unit tests for every goal, both sexes, the floor and the limits.

Show one line with every result: "This is an estimate, not medical advice."

## 9. Security (first priority)

The site holds personal and body data. Treat it as sensitive.

- Validate every input on the server with Zod. Never trust the client.
- Every query that touches user data is filtered by the session user ID on the server. Never take a user ID from the request body or URL for authorisation.
- Admin routes check the role on the server on every request.
- Prisma only. No raw SQL built from strings.
- Never use `dangerouslySetInnerHTML`.
- Session cookies: `httpOnly`, `secure`, `sameSite=lax`. CSRF protection on every mutation.
- Rate limit login, signup, password reset, checkout and chat.
- Login and reset responses never reveal whether an email exists.
- Security headers: strict Content-Security-Policy, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, frame blocking.
- Secrets only in env vars. Validate env at startup with Zod and fail fast. Provide `.env.example` with no real values. Nothing secret in `NEXT_PUBLIC_*`.
- Never log passwords, tokens, body data or full request bodies.
- Prices and totals are always calculated on the server from the database. Never accept a price from the client.
- Collect the minimum data. Ask for clear consent before saving body data. Provide "download my data" and "delete my account" functions that really delete.
- Return generic error messages to the client; keep details in server logs.

## 10. Performance

- Server Components by default. Add `"use client"` only where there is real interaction.
- Catalogue and plan pages are statically generated and revalidated when admin changes data.
- `next/image` for every image with set sizes.
- Load the chatbot code only when the customer opens it.
- Database indexes on every foreign key and every field used in a filter. No N+1 queries. Paginate every list.
- Target: Lighthouse performance 95+ on mobile, no layout shift.

## 11. Data model (starting point)

- `User` — email, passwordHash, name, phone, role (`customer` | `admin`)
- `Profile` — userId, age, sex, heightCm, weightKg, gymDaysPerWeek, goal, consentAt
- `NutritionTarget` — userId, calories, proteinG, carbsG, fatG, createdAt
- `Meal` — name, slug, description, imageUrl, calories, proteinG, carbsG, saltG, mealType (`breakfast` | `lunch` | `dinner`), active
- `Product` — name, slug, imageUrl, price, calories, proteinG, carbsG, saltG, active
- `Plan` — name, goal, billingPeriod (`weekly` | `monthly`), price, calorieMin, calorieMax, active
- `DeliveryLocation` — name (first row: SLIIT campus), type (`campus` | `address`), active
- `Subscription` — userId, planId, deliveryLocationId, addressLine, startDate, status (`pending` | `active` | `paused` | `cancelled`), renewsAt
- `Order` — userId, subscriptionId, total, paymentMethod, paymentStatus, createdAt
- `OrderItem` — orderId, productId, quantity, unitPrice
- `Delivery` — subscriptionId, date, mealType, status

Money is stored as integer cents in LKR. Propose changes if you see a problem, and explain why before making them.

## 12. Code rules

- Structure: `app/` routes, `lib/` business logic, `components/` UI, `prisma/` schema and seed. No business logic inside components or route files; they call `lib/`.
- Mutations use Server Actions; each one does: check session → validate with Zod → check ownership → act → return a typed result `{ ok, data | error }`.
- No dead code, no TODOs left behind, no `console.log` in committed code.
- ESLint and Prettier must pass. `npm run build` must pass with zero warnings.
- Every step ends with: what was built, files changed, how to run and test it, anything you were unsure about.

## 13. Build order

Do **one step at a time** and wait for "next" before continuing.

1. **Project setup** — Next.js app, Tailwind, ESLint, Prettier, Vitest, env validation, `.env.example`, security headers, folder structure, README with run commands.
2. **Database** — Prisma schema from section 11, first migration, seed script with sample meals, plans and the delivery location.
3. **Auth** — signup, login, logout, password reset, sessions, role check helper, rate limiting.
4. **Calculator engine** — `lib/nutrition/` with config, `calculate()`, Zod schema, plan recommendation, full unit tests.
5. **Calculator page** — plain form, result screen, guest result carried into signup.
6. **Catalogue** — meals, products and plans pages reading from the database.
7. **Subscription and checkout** — plan selection, delivery location, start date, cash on delivery, order confirmation, pause and cancel.
8. **Account** — profile, targets, subscription, order history, download and delete my data.
9. **Chatbot** — provider file, system prompt, chat route, structured extraction, limits, result hand-off.
10. **Admin** — meals, plans, locations, subscriptions, daily delivery list.
11. **Hardening** — review every item in sections 9 and 10 against the code, fix gaps, report the result as a checklist.

**Start now with step 1 only.**
