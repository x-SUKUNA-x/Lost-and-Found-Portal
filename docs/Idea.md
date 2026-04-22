# 💡 FoundIt — Lost & Found Portal

## Project Idea Document

---

## 1. Project Title

**FoundIt — A Community-Driven Lost & Found Portal**

---

## 2. Problem Statement

Every year, millions of personal belongings are lost in public spaces — universities, offices, transit systems, and community areas. The traditional approach to recovering lost items relies on fragmented methods: physical bulletin boards, word-of-mouth, or disconnected social media posts. These methods suffer from:

- **Limited visibility** — posts get buried in social feeds within hours
- **No structured categorization** — making it hard to search for specific items
- **Zero accountability** — no verification process for claims
- **No centralized platform** — lost and found efforts are scattered across multiple channels

> *According to a 2023 study, over 60% of lost items in public spaces are never reunited with their owners — not because they aren't found, but because there is no efficient system to connect finders with owners.*

---

## 3. Proposed Solution

**FoundIt** is a full-stack web application that provides a centralized, secure, and user-friendly platform for reporting and claiming lost & found items. It bridges the gap between people who lose items and those who find them through:

- **Structured item reporting** with categories, locations, and descriptions
- **Smart search & filtering** to quickly find relevant items
- **Claim management system** with approval workflows
- **Authentication & authorization** to ensure trust and accountability
- **Real-time dashboard** for users to track their items and claims

---

## 4. Objectives

| # | Objective | Priority |
|---|-----------|----------|
| 1 | Build a secure authentication system using Supabase Auth | 🔴 High |
| 2 | Enable users to report lost/found items with detailed information | 🔴 High |
| 3 | Implement a claim system with owner approval workflow | 🔴 High |
| 4 | Provide search and filter capabilities by category, status, location | 🟡 Medium |
| 5 | Create a personal dashboard for tracking items and claims | 🟡 Medium |
| 6 | Ensure responsive design for mobile and desktop users | 🟡 Medium |
| 7 | Implement Row Level Security for data protection | 🟢 Optional |

---

## 5. Technology Stack

### Architecture: **3-Tier Client-Server**

```
┌────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                        │
│         React 19 · Vite · TypeScript · Tailwind CSS         │
│              Deployed on: Vercel                            │
├────────────────────────────────────────────────────────────┤
│                     APPLICATION TIER                        │
│       Node.js · Express · TypeScript · REST API             │
│              Deployed on: Render                            │
├────────────────────────────────────────────────────────────┤
│                       DATA TIER                             │
│      Supabase (PostgreSQL) · Supabase Auth · RLS            │
│              Hosted on: Supabase Cloud                      │
└────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite, TypeScript | Component-based SPA with type safety |
| **Styling** | Tailwind CSS, Material Design 3 | Modern, responsive UI with design tokens |
| **Backend** | Node.js, Express, TypeScript | RESTful API with clean architecture |
| **Database** | Supabase (PostgreSQL) | Managed relational database with RLS |
| **Auth** | Supabase Auth (JWT) | Secure authentication without custom hashing |
| **HTTP Client** | Axios | API communication with interceptors |
| **Deployment** | Vercel (FE) + Render (BE) | CI/CD with Git integration |

---

## 6. Key Features

### 6.1 User Authentication
- Secure signup/login via Supabase Auth
- JWT-based session management
- Protected routes for authenticated actions

### 6.2 Item Management
- Report lost or found items with title, description, category, location
- Status tracking: `Lost` → `Found` → `Claimed`
- Edit and delete own items

### 6.3 Claim System
- Submit claims with a descriptive message
- Item owners can approve or reject claims
- Users cannot claim their own items (enforced by RLS)

### 6.4 Search & Discovery
- Filter items by status (All / Lost / Found)
- Search by keywords across title and description
- Category-based filtering

### 6.5 Personal Dashboard
- View all posted items with statistics
- Track submitted claims and their status
- Quick-access stats: Total Items, Lost, Found, Claims

---

## 7. Target Users

| User Type | Description |
|-----------|-------------|
| **Students** | University students who lose/find items on campus |
| **Employees** | Office workers in shared workspaces |
| **Community Members** | Residents in gated communities, housing societies |
| **Administrators** | Platform moderators who oversee item listings |

---

## 8. Scope & Limitations

### In Scope
- ✅ User registration and authentication
- ✅ CRUD operations for items
- ✅ Claim submission and status management
- ✅ Search and filter functionality
- ✅ Personal dashboard with statistics
- ✅ Responsive web design

### Out of Scope (Future Enhancements)
- ❌ Image upload for items (planned for v2)
- ❌ Real-time notifications (Supabase Realtime — planned)
- ❌ Geolocation-based proximity search
- ❌ Mobile native app (React Native)
- ❌ Admin moderation panel

---

## 9. Expected Outcomes

1. **Increased recovery rate** of lost items through centralized reporting
2. **Reduced time** between losing and recovering an item
3. **Trusted platform** with verified users and structured claim workflows
4. **Scalable architecture** ready for institutional adoption

---

## 10. Team & Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Planning & Design | Week 1 | Idea document, UML diagrams, wireframes |
| Backend Development | Week 2-3 | API, database schema, authentication |
| Frontend Development | Week 3-4 | UI components, pages, API integration |
| Testing & Deployment | Week 5 | End-to-end testing, Render + Vercel deploy |

---

## 11. References

1. Supabase Documentation — https://supabase.com/docs
2. React Documentation — https://react.dev
3. Express.js Guide — https://expressjs.com/en/guide
4. Material Design 3 — https://m3.material.io
5. TypeScript Handbook — https://www.typescriptlang.org/docs

---

*Document prepared for: **FoundIt — Lost & Found Portal***
*Version: 1.0 | Date: April 2026*
