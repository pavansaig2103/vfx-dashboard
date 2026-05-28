# CineTrack Pro

CineTrack Pro is a full-stack VFX shot tracking dashboard for a film and video production studio. It helps post-production teams manage shots from assignment through review, version updates, approval, and final delivery.

## Problem Statement

VFX teams often track deadlines, versions, feedback, and artist workload across disconnected spreadsheets and chat threads. This makes it hard to see which shots are overdue, which artists are overloaded, and what action is needed next.

## Solution Overview

CineTrack Pro provides a premium studio control-room dashboard with JWT login, SQLite-backed shot records, feedback history, version tracking, deadline scheduling, and artist workload analytics.

## Features

- Secure login with JWT authentication
- Dashboard KPIs for total, pending, in-progress, review, approved, delivered, and overdue shots
- Today's deadlines, high-priority shots, artist workload, pipeline chart, and recent feedback
- Shot management table with search, status/artist/priority filters, deadline sorting, and overdue highlighting
- Add shot workflow with VFX-specific fields
- Shot details page with overview, countdown, badges, media preview, notes, feedback history, and recommended next action
- Version tracking for `v001` through `v004`
- Calendar/list scheduling view for due today, this week, overdue, and upcoming shots
- Artist workload page for Rohan, Meera, Arjun, Sana, and Vikram
- Seeded SQLite database with 25 realistic VFX shots

## Tech Stack

Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide React, Framer Motion

Backend: Node.js, Express.js, SQLite, JWT, bcrypt, REST APIs

## Project Structure

```text
cinetrack-pro/
  client/          React + Vite frontend
  server/          Express + SQLite backend
  README.md
  package.json     Workspace helper scripts
```

## Demo Credentials

```text
email: admin@cinetrack.com
password: admin123
```

## Setup Instructions

Install dependencies:

```bash
npm run install:all
```

Start the backend:

```bash
npm run server
```

Start the frontend in another terminal:

```bash
npm run client
```

Open:

```text
http://localhost:5173
```

The API runs on:

```text
http://localhost:5000
```

## API Routes

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`

Shots:

- `GET /api/shots`
- `GET /api/shots/:id`
- `POST /api/shots`
- `PUT /api/shots/:id`
- `DELETE /api/shots/:id`

Feedback:

- `GET /api/shots/:id/feedback`
- `POST /api/shots/:id/feedback`

Stats:

- `GET /api/stats/dashboard`
- `GET /api/stats/artists`
- `GET /api/stats/calendar`

## Screenshots

Add screenshots here after running the app:

- Login Page
- Dashboard
- Shot Management
- Shot Details
- Calendar / Scheduling
- Artist Workload

## Deployment

Frontend:

```bash
cd client
npm run build
```

Deploy `client/dist` to Netlify, Vercel, or any static host. Set `VITE_API_URL` to the deployed backend URL.

Backend:

Deploy `server/` to Render, Railway, Fly.io, or a VPS. Set these environment variables:

```text
PORT=5000
JWT_SECRET=replace-with-a-secure-secret
```

## Future Improvements

- File uploads for plates, previews, and final delivery packages
- Role-based permissions for producers, supervisors, artists, and clients
- Kanban pipeline drag-and-drop
- Email/slack deadline alerts
- Shot comments with attachments
- Production-level audit logs and activity feed
