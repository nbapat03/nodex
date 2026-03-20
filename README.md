# NodeX — Complaint & Issue Management System

A full-stack web application for submitting, tracking, and resolving complaints built with the MERN stack.

🔗 **Live Demo:** https://nodex-delta.vercel.app

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT
- **Deployed on:** Vercel (frontend) + Render (backend)

---

## Features

- User registration & login with JWT authentication
- Submit complaints with category and priority
- Real-time complaint status tracking
- In-app notifications on status updates
- Admin dashboard with analytics and charts
- Role-based access control (User / Admin)

---

## Getting Started
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp backend/.env.example backend/.env
# Add your MONGO_URI and JWT_SECRET in .env

# Run the app
cd backend && node server.js       # Terminal 1
cd frontend && npm run dev         # Terminal 2
```

Open http://localhost:5173

---

## Developed By

Manan Chawhan & Nakshatra Bapat
MCA Semester IV — Parul University, A.Y. 2025-2026
