# NodeX — Web-Based Complaint & Issue Management System

A full-stack complaint and issue management system built with **React**, **Node.js/Express**, and **MongoDB** — based on the NodeX project specification by Manan Chawhan & Nakshatra Bapat, Parul University MCA.

---

## 🗂 Project Structure

```
nodex/
├── backend/               # Node.js + Express REST API
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth middleware (JWT)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── server.js          # Entry point
│   └── .env.example       # Environment variables template
│
├── frontend/              # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/    # Layout, Sidebar, ProtectedRoute
│       ├── context/       # Auth context (JWT state)
│       ├── pages/         # All page components
│       └── utils/         # API client, helpers, badges
│
└── package.json           # Root scripts (run both servers)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd nodex
npm install          # installs concurrently
npm run install:all  # installs backend & frontend dependencies
```

### 3. Configure Environment
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nodex
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

### 4. Seed Initial Data (optional)
Run the MongoDB shell or Compass to insert starter categories:
```js
use nodex
db.categories.insertMany([
  { name: "Infrastructure", description: "Roads, buildings, facilities", isActive: true },
  { name: "Service Quality", description: "Staff behavior, response time", isActive: true },
  { name: "Technical Issue", description: "Software or hardware problems", isActive: true },
  { name: "Billing", description: "Payment and invoice issues", isActive: true },
  { name: "Other", description: "Miscellaneous complaints", isActive: true }
])
```

### 5. Create an Admin User
Register normally, then update the role in MongoDB:
```js
db.users.updateOne({ email: "admin@nodex.com" }, { $set: { role: "admin" } })
```

### 6. Run the App
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🔑 User Roles

| Role | Access |
|------|--------|
| `user` | Register, submit complaints, track status, view notifications |
| `admin` | All user features + manage/assign/update/close all complaints, view analytics, manage categories |
| `superadmin` | All admin features (future: user management) |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Complaints (User)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Submit complaint |
| GET | `/api/complaints/my` | Get own complaints |
| GET | `/api/complaints/:id` | Get complaint detail |

### Complaints (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/complaints/:id/status` | Update status |
| PATCH | `/api/complaints/:id/assign` | Assign to admin |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/complaints` | All complaints (filterable) |
| GET | `/api/admin/analytics` | Dashboard stats + charts data |
| GET | `/api/admin/users` | All users |

### Categories & Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List active categories |
| POST | `/api/categories` | Add category (admin) |
| GET | `/api/notifications` | User notifications |
| PATCH | `/api/notifications/mark-read` | Mark all as read |

---

## 🗃 Data Models

### User
```
_id, name, email, password (hashed), role, isActive, timestamps
```

### Complaint
```
_id, complaintId (NX-00001), title, description, category (ref),
status (Pending/In Progress/Resolved/Closed/Rejected),
priority (Low/Medium/High/Critical), submittedBy (ref User),
assignedTo (ref User), statusHistory[], resolvedAt, closedAt, timestamps
```

### Notification
```
_id, recipient (ref User), complaint (ref), message, type, isRead, timestamps
```

### Category
```
_id, name, description, isActive, timestamps
```

---

## 🎨 Frontend Pages

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | User Dashboard | User |
| `/complaints` | My Complaints list | User |
| `/complaints/new` | Submit Complaint form | User |
| `/complaints/:id` | Complaint Detail + Timeline | User |
| `/notifications` | Notifications | User |
| `/admin/dashboard` | Admin Dashboard + KPIs | Admin |
| `/admin/complaints` | All Complaints table | Admin |
| `/admin/complaints/:id` | Complaint + Actions panel | Admin |
| `/admin/analytics` | Charts & Analytics | Admin |
| `/admin/users` | User list | Admin |
| `/admin/categories` | Manage categories | Admin |

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd frontend && npm run build
# Deploy /dist to Vercel
```

### Railway / Render (Backend)
Set environment variables in the dashboard, deploy from GitHub.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios |
| Notifications | react-hot-toast |

---

## 📄 License
Academic project — Parul University MCA, A.Y. 2025-2026
