# StudySync — Backend (REST API)

Backend service for **StudySync**, a study-partner matching platform.  
This API powers partner profile creation, partner browsing/searching/sorting, and “My Connections” operations used by the frontend.

> Tech focus: simple, fast REST endpoints + MongoDB storage + secure requests from the client.

---

## Features

- Create & store **study partner profiles**
- Browse all partners
- Search partners (used by the client’s “Search by subject”)
- Sort partners (used by the client’s experience-level sort)
- “My Connections” list for a logged-in user
- Update and delete connection/profile records (as used in the dashboard)

---

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** (Atlas or local)
- Common middleware: `cors`, `dotenv`
- Deployed-ready config (includes `vercel.json`)

---

## Getting Started

### 1) Clone & install

```bash
git clone <YOUR_BACKEND_REPO_URL>
cd StudySync-BackEnd
npm install
```

### 2) Environment variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# If you use JWT in your secure axios flow:
JWT_SECRET=your_super_secret_key

# Optional:
CLIENT_URL=http://localhost:5173
```

> If your project uses a different Mongo setup (like `DB_USER`, `DB_PASS`, `DB_NAME`), keep those keys instead—this template is just the common format.

### 3) Run locally

```bash
# dev mode (recommended)
npm run dev

# production
npm start
```

Your server should be available at:

- `http://localhost:<PORT>`

---

## API Endpoints (used by the frontend)

These routes are based on what the frontend calls in the current StudySync client code.

### Partners

- `GET /all-partners` — get all partner profiles  
- `GET /partners?search=<term>` — search partners (e.g., by subject)
- `GET /partners/sort?expSort=<Expert|Intermediate|Beginner>` — sort by experience
- `POST /create/partner` — create a partner profile

### Connections (dashboard)

- `GET /partner/connected/:email` — get connections by user email
- `PATCH /partner/update/:id` — update a connection record
- `DELETE /partner/delete/:id` — delete a connection record

> Tip: Add a `/health` route (or `/`) that returns `{ ok: true }` to make deployments and uptime checks easier.

---

## Deployment

This repo includes a `vercel.json`, so it can be deployed to **Vercel** as a Node/Express API.

Typical steps:
1. Push to GitHub
2. Import the repo in Vercel
3. Add the `.env` variables in Vercel Project Settings
4. Deploy

---

## Project Structure (typical)

```
StudySync-BackEnd/
├─ index.js
├─ package.json
├─ vercel.json
└─ ...
```

---

## Contributing

If you want to extend the API:

- Keep routes consistent with the frontend calls
- Validate inputs on create/update endpoints
- Add pagination for `/all-partners` when the dataset grows
- Add authentication middleware for protected routes (recommended)

---
