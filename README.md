# URL Shortener

A minimal API service that shortens long URLs and redirects visitors to the original destination. Users sign up or sign in to create and manage their short links.

---

## Goal

- **Shorten URLs** — Submit a long URL and get a short, shareable link.
- **Redirect** — Visiting `/:shortUrl` redirects to the original URL.
- **User-scoped** — Auth via JWT; users can list and delete only their own URLs.

---

## Tech Stack

| Layer        | Technology        |
| ------------ | ----------------- |
| Runtime      | Node.js (≥ 22.12) |
| Framework    | Express 5         |
| Database     | PostgreSQL        |
| ORM          | Drizzle ORM       |
| Validation   | Zod               |
| Auth         | JWT (jsonwebtoken)|
| Package mgr  | pnpm              |

---

## Project Structure

```
url-shortner/
├── index.js                 # App entry, routes mounting
├── package.json
├── drizzle.config.js        # Drizzle Kit config
├── db/
│   └── index.js             # DB connection (Drizzle instance)
├── models/
│   ├── index.js             # Schema exports
│   ├── user.model.js        # users table
│   └── url.model.js         # urls table (shortUrl, originalUrl, userId)
├── drizzle/                 # Migrations (generated)
│   ├── *.sql
│   └── meta/
├── routes/
│   ├── user.routes.js       # POST /user/signup, /user/signin
│   └── url.route.js         # Shorten, list, delete, redirect
├── controllers/
│   ├── user.controller.js  # signup, signin
│   └── url.controller.js   # shorten, redirect, getAllUrls, deleteUrlById
├── services/
│   ├── user.service.js     # User creation, lookup
│   └── url.service.js      # URL create, find, delete
├── middlewares/
│   └── auth.middleware.js  # JWT verification
├── validations/
│   ├── request.validation.js
│   └── token.validation.js
└── utils/
    ├── hash.js              # Password hashing
    └── token.js             # JWT sign/verify
```

---

## API Overview

| Method | Path            | Auth   | Description                    |
| ------ | --------------- | ------ | ------------------------------ |
| GET    | `/`             | No     | Service info                   |
| POST   | `/user/signup`  | No     | Register (firstName, lastName, email, password) |
| POST   | `/user/signin`  | No     | Login (email, password) → JWT  |
| POST   | `/shorten`      | Yes    | Create short URL (originalUrl) |
| GET    | `/urls`         | Yes    | List current user’s URLs       |
| DELETE | `/:id`          | Yes    | Delete URL by id               |
| GET    | `/:shortUrl`    | No     | Redirect to original URL       |

Protected routes use the `Authorization: Bearer <token>` header.

---

## Getting Started

### Prerequisites

- Node.js ≥ 22.12
- PostgreSQL
- pnpm (`npm install -g pnpm`)

### Setup

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd url-shortner
   pnpm install
   ```

2. **Environment**

   Create a `.env` in the project root:

   ```env
   PORT=8080
   DATABASE_URL=postgresql://user:password@localhost:5432/url_shortener
   JWT_SECRET=your-secret-key
   ```

3. **Database**

   ```bash
   pnpm db:migrate
   ```

4. **Run**

   ```bash
   pnpm start
   ```

   Server runs at `http://localhost:8080` (or your `PORT`). Use `pnpm start` for dev with `--watch`.

### Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `pnpm start`      | Run app (with watch)       |
| `pnpm db:generate`| Generate Drizzle migrations|
| `pnpm db:migrate` | Run migrations             |
| `pnpm db:studio`  | Open Drizzle Studio        |

---
