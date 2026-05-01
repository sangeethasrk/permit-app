# Permit Application Manager

Simple full-stack MVP for permit application workflows.

## Project Structure

```text
permit-app/
  client/   # Vite + React + TypeScript
  server/   # Express + TypeScript + SQLite
```

## Roles and Workflow

- **Citizen flow**
  - Create permit draft
  - Submit draft for review
- **Admin flow**
  - View permits
  - Filter by permit type
  - Approve or reject submitted permits

### Status Lifecycle

`draft -> submitted -> approved | rejected`

Invalid transitions are blocked.

## What Is Implemented

### Backend (`server`)

- Express REST API
  - `POST /permits`
  - `GET /permits?status=&permitType=`
  - `PATCH /permits/:id/status`
- SQLite persistence (`server/permits.db`)
- DB bootstrap module (`server/db.js`) with table creation
- Parameterized SQL queries for insert/select/update
- Validation
  - Required fields
  - Allowed permit types:
    - Electrical
    - Paving
    - Roofing
    - Plumbing
    - New Construction
  - Allowed statuses and transition rules

### Frontend (`client`)

- Citizen page
  - Controlled form fields
  - Permit type dropdown
  - Save draft action (POST)
  - Submit application action (PATCH to `submitted`)
  - Loading and error states
- Admin dashboard
  - Permit listing from API
  - Filter by permit type
  - Approve/Reject actions for submitted permits
- Minimal in-app view toggle between Citizen and Admin pages

### Tests

- Minimal unit test setup with Vitest (server only)
- Tests for core status business logic (`server/models/permitModel.test.ts`)

## Run the App

### Install dependencies

```bash
npm install
npm --prefix client install
npm --prefix server install
```

### Start app (client + server)

```bash
npm run dev
```

- Client: `http://localhost:5173` (or next available port)
- Server: `http://localhost:4000`

## Build

```bash
npm run build
```

## Run Tests

```bash
cd server
npm test
```

## Notes / Current Limitations

- No authentication/authorization yet (Citizen/Admin is UI-level only)
- No pagination/sorting on permit list yet
- No route-level API integration tests yet (only unit tests for core logic)
