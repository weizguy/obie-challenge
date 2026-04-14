# Obie Carrier Search

A full-stack web application that allows users to search for available insurance carriers by state and coverage type. Data is sourced dynamically from a Google Sheets spreadsheet.

---

## Tech Stack

**Frontend**
- React with TypeScript
- Create React App

**Backend**
- Node.js with Express
- TypeScript
- csv-parse

---

## Project Structure
```
obie-challenge/
├── frontend/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── CarrierSearch.tsx
│       │   ├── CarrierSearch.css
│       │   ├── Header.tsx
│       │   └── Header.css
│       └── styles/
│           └── theme.css
├── backend/           # Node/Express backend
│   └── src/
│       ├── controllers/
│       │   └── sheetsController.ts
│       ├── routes/
│       │   └── sheetsRoutes.ts
│       ├── services/
│       │   └── sheetsService.ts
│       └── index.ts
└── package.json       # Root package.json
```
---

## Prerequisites

- Node.js v18+
- npm v9+

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/obie-challenge.git
cd obie-challenge
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend

# Install backend dependencies
npm install --prefix backend
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` folder:

SPREADSHEET_ID=your_google_spreadsheet_id_here
GID_AUTO_FIRE=137794754
GID_FLOOD=1431100651

The spreadsheet ID can be found in the Google Sheets URL:

https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit

### 4. Run the application

```bash
npm run dev
```

This starts both the frontend and backend concurrently:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Available Scripts

### Root
| Script | Description |
|--------|-------------|
| `npm run dev` | Starts frontend and backend concurrently |
| `npm test` | Runs all tests across frontend and backend |

### Frontend
| Script | Description |
|--------|-------------|
| `npm start` | Starts the React development server |
| `npm test` | Runs frontend tests |
| `npm run build` | Builds the app for production |

### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the backend with nodemon |
| `npm test` | Runs backend tests |
| `npm run build` | Compiles TypeScript to JavaScript |
| `npm start` | Runs the compiled JavaScript |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sheets/name/:tabName` | Fetch sheet data by tab name (supports partial match e.g. `auto`, `fire`, `flood`) |
| `GET` | `/api/sheets/gid/:gid` | Fetch sheet data by tab GID |
| `POST` | `/api/sheets/refresh` | Clear the sheet data cache |

### Example Requests

```bash
# Fetch auto/fire carriers
GET /api/sheets/name/auto
GET /api/sheets/name/fire

# Fetch flood carriers
GET /api/sheets/name/flood

# Fetch by GID
GET /api/sheets/gid/137794754

# Refresh cache after spreadsheet update
POST /api/sheets/refresh
```

---

## Updating Spreadsheet Data

The backend caches Google Sheets data for 1 hour to avoid excessive requests. When the spreadsheet is updated:

1. **Wait** for the cache to expire automatically (1 hour), or
2. **Manually refresh** by calling:
```bash
curl -X POST http://localhost:5000/api/sheets/refresh
```

If a new tab is added to the spreadsheet, update `backend/.env` with the new GID and add the corresponding entry in `sheetsService.ts`.

---

## Running Tests

```bash
# Run all tests
npm test

# Run backend tests only
npm test --prefix backend

# Run frontend tests only
npm test --prefix frontend -- --watchAll=false
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SPREADSHEET_ID` | Google Sheets spreadsheet ID | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms` |
| `GID_AUTO` | GID of the Auto/Fire tab | `137794754` |
| `GID_FLOOD` | GID of the Flood tab | `1431100651` |

---

## License

This project is private and intended for internal use only.