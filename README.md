# 🎓 SmartAdmit — School Admission Management System

A full-stack admission management platform built with:
- **Frontend**: React + Vite
- **Backend**: Spring Boot 3 + Spring Security + JWT
- **Database**: PostgreSQL

---

## 📁 Project Structure

```
smartadmit/
├── frontend/                  ← React + Vite app
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           ← Axios with JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx    ← Global auth state
│   │   ├── components/
│   │   │   └── DashboardLayout.jsx ← Sidebar + Header layout
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       ← Public landing page
│   │   │   ├── LoginPage.jsx      ← Login for all roles
│   │   │   ├── RegisterPage.jsx   ← Self-register (STUDENT / SCHOOL)
│   │   │   ├── student/
│   │   │   │   └── StudentDashboard.jsx
│   │   │   ├── school/
│   │   │   │   └── SchoolDashboard.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx
│   │   ├── App.jsx               ← Routes
│   │   ├── main.jsx
│   │   └── index.css             ← Full design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/                   ← Spring Boot app
    ├── src/main/java/com/smartadmit/
    │   ├── SmartAdmitApplication.java
    │   ├── config/
    │   │   ├── SecurityConfig.java      ← JWT + CORS + role security
    │   │   ├── DataSeeder.java          ← Seeds demo users on startup
    │   │   └── GlobalExceptionHandler.java
    │   ├── controller/
    │   │   ├── AuthController.java      ← /api/auth/**
    │   │   ├── StudentController.java   ← /api/student/**
    │   │   ├── SchoolController.java    ← /api/school/**
    │   │   └── AdminController.java     ← /api/admin/**
    │   ├── dto/
    │   │   ├── AuthDto.java
    │   │   └── AppDto.java
    │   ├── model/
    │   │   ├── User.java
    │   │   ├── School.java
    │   │   └── Application.java
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   ├── SchoolRepository.java
    │   │   └── ApplicationRepository.java
    │   ├── security/
    │   │   ├── JwtUtil.java
    │   │   ├── JwtAuthFilter.java
    │   │   └── CustomUserDetailsService.java
    │   └── service/
    │       ├── AuthService.java
    │       ├── StudentService.java
    │       ├── SchoolService.java
    │       └── AdminService.java
    └── src/main/resources/
        ├── application.properties
        └── schema.sql              ← Reference SQL (JPA auto-creates)
```

---

## 🚀 Setup & Run Instructions

### ✅ Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org |
| Node.js | 18+ | https://nodejs.org |
| PostgreSQL | 14+ | https://www.postgresql.org |

---

### 🗄️ Step 1 — Setup PostgreSQL Database

**Option A: Using psql command line**
```bash
# Open psql as postgres user
psql -U postgres

# Run this command
CREATE DATABASE smartadmit;

# Exit
\q
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name it: `smartadmit`
4. Click Save

**Verify connection settings** in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smartadmit
spring.datasource.username=postgres
spring.datasource.password=postgres   ← Change this to your actual password
```

---

### ⚙️ Step 2 — Run the Backend (Spring Boot)

```bash
# Navigate to backend folder
cd smartadmit/backend

# Build and run with Maven
./mvnw spring-boot:run

# On Windows use:
mvnw.cmd spring-boot:run
```

You should see:
```
✅ SmartAdmit data seeding complete.
Started SmartAdmitApplication on port 8080
```

> Spring Boot will **automatically create all tables** using JPA (ddl-auto=update).
> The DataSeeder will seed demo users automatically.

---

### 🖥️ Step 3 — Run the Frontend (React + Vite)

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd smartadmit/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🔑 Demo Login Credentials

These are seeded automatically when the backend starts:

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@demo.com | password123 |
| 🎓 Student | student@demo.com | password123 |
| 🏫 School | school@demo.com | password123 |
| 👑 Admin (main) | admin@smartadmit.com | admin123 |

---

## 🌐 API Endpoints Reference

### Auth (Public)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register student or school |
| POST | `/api/auth/login` | Login (all roles) |

### Student (Role: STUDENT)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/student/stats` | Dashboard stats |
| GET | `/api/student/applications` | My applications |
| GET | `/api/student/schools` | All schools with seat info |
| POST | `/api/student/apply` | Apply to a school |

### School (Role: SCHOOL)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/school/stats` | Dashboard stats |
| GET | `/api/school/profile` | Get school profile |
| PUT | `/api/school/profile` | Update profile |
| GET | `/api/school/applications` | All applications to this school |
| PUT | `/api/school/applications/{id}/{action}` | Accept/reject (action = approved/rejected) |

### Admin (Role: ADMIN)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/schools` | All schools |
| POST | `/api/admin/schools` | Create school |
| DELETE | `/api/admin/schools/{id}` | Delete school |
| GET | `/api/admin/students` | All students |
| POST | `/api/admin/students` | Create student |
| DELETE | `/api/admin/students/{id}` | Delete student |

---

## 🎨 Features by Role

### 🎓 Student Dashboard
- **Dashboard Tab** — Cards: Total Schools, Pending Applications, Approved, Total Applied. Table of recent applications.
- **Apply for Admission Tab** — Browse all schools with available seats. Apply with one click.
- **View All Schools Tab** — Full table of all schools with seat availability status.
- **Logout** — Clears session and redirects to homepage.

### 🏫 School Dashboard
- **Dashboard Tab** — Cards: Total Applications, Pending, Approved, Rejected. Recent applications table.
- **School Profile Tab** — View and edit all school information (name, board, seats, principal, etc.)
- **View Applications Tab** — Filter by All/Pending/Approved/Rejected. Accept or Reject pending applications.
- **Logout**

### 👑 Admin Dashboard
- **Dashboard Tab** — Cards: Total Schools, Total Students, Total Applications, Pending.
- **Manage Schools Tab** — Table of all schools. Create new school (with login credentials). Delete school.
- **Manage Students Tab** — Table of all students. Create student account. Delete student.
- **Logout**

---

## 🔒 Security

- Passwords are hashed with **BCrypt**
- All API routes (except `/api/auth/**`) require a valid **JWT Bearer token**
- Role-based access enforced at Spring Security level:
  - `/api/student/**` → ROLE_STUDENT only
  - `/api/school/**` → ROLE_SCHOOL only
  - `/api/admin/**` → ROLE_ADMIN only
- JWT expires in **24 hours**
- Frontend auto-redirects to `/login` on 401

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `Connection refused` on backend start | Check PostgreSQL is running and password in `application.properties` is correct |
| `Port 8080 already in use` | Change `server.port=8081` in `application.properties`, update Vite proxy too |
| `npm install` fails | Make sure Node.js v18+ is installed |
| Tables not created | Make sure `spring.jpa.hibernate.ddl-auto=update` is set |
| Login returns 401 | Check you are using the exact seeded credentials from the table above |
| CORS error | Frontend must run on `http://localhost:5173` (matches `cors.allowed-origins` in properties) |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite 5 |
| Frontend Routing | React Router v6 |
| HTTP Client | Axios |
| Toast Notifications | React Hot Toast |
| Icons | Lucide React |
| Backend Framework | Spring Boot 3.2 |
| Security | Spring Security + JWT (JJWT) |
| ORM | Spring Data JPA / Hibernate |
| Database | PostgreSQL |
| Build Tool | Maven |
| Code Reduction | Lombok |

---

Made with ❤️ — SmartAdmit © 2024
