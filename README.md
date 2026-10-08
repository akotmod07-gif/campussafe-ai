# CampusSafe AI 🛡️
### *Safer Campus. Faster Response. Smarter Emergency Management.*

[![Node.js](https://img.shields.io/badge/Node.js-v24.20.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 1. Project Overview & Problem Statement

### Problem Statement
College campuses host thousands of students, faculty, and visitors across large multi-building complexes. When an emergency strikes—such as a chemistry lab fire, a student fainting in a crowded cafeteria, late-night harassment in poorly lit zones, or vehicle accidents—traditional campus emergency response suffers from critical vulnerabilities:
1. **Reporting Friction:** Panic-stricken students struggle to find campus police contact numbers or describe exact coordinates.
2. **Delayed Triage:** Campus dispatch operators receive ambiguous calls and lose critical minutes manually classifying severity.
3. **Information Silos:** Students who submit a report have no visibility into whether response teams have been dispatched or are en route.
4. **Responder Misallocation:** High-stakes situations (e.g. fire hazards) get placed in the same queue as non-urgent incidents (e.g. lost IDs).

### The Solution: CampusSafe AI
**CampusSafe AI** is an intelligent, full-stack campus emergency and safety platform engineered for collegiate hackathons and real-world deployment. 
- **1-Click SOS Protocol:** Immediate 5-second countdown distress broadcast with campus landmark GPS coordinates.
- **Real-Time NLP AI Triage Engine:** Evaluates emergency descriptions as students type, categorizing the incident, assessing severity (Low, Medium, High, Critical), assigning priority (Low, Normal, Urgent, Immediate), and calculating confidence scores.
- **Live 4-Phase Progress Timeline:** Keeps students, dispatchers, and field responders synchronized across `Reported` → `Assigned` → `Responding` → `Resolved`.
- **Command Operations Console:** Gives security administrators full control to filter incidents, assign specialized response units (`Campus Security Team A/B`, `Medical Team`, `Fire Response Team`, `Student Welfare Team`), log real-time field notes, and officially resolve emergencies.
- **Fail-Safe Zero-Crash Architecture:** Operates with a live MongoDB REST API, while featuring an automatic reactive local-storage fallback mode to guarantee zero-latency 100% reliable hackathon judging demos.

---

## ✨ 2. Key Features

- **🚨 1-Click SOS Emergency:** Dedicated SOS interface with pulse radar animation, hazard type selection, simulated campus GPS geofencing, and 5-second cancelable countdown.
- **🧠 Live AI Incident Classifier:** Instant NLP rule engine that triggers in real-time as users type descriptions (e.g., *"smoke coming from electronics laboratory"* automatically classifies as **Fire / Critical / Immediate** with 98% confidence).
- **📊 Interactive Admin Command Center:** Real-time statistics cards (Total, Active, Critical, Resolved, Avg Response Time), dynamic SVG distribution charts (Categories, Status pipeline, 24-hr Activity), and multi-parameter filters (Search by ID, Location, Reporter).
- **📋 Dispatch Dossier & Audit Logs:** Complete incident history with reporter contact information, responder assignment dropdowns, live timestamped notes, and 1-click incident closure.
- **🔔 Real-time Notifications System:** Navbar dropdown with unread badge counter, alert level icons, 1-click "Mark All as Read", and direct navigation to incident tracking.
- **👥 Role-Based Authentication:** Protected JWT routes with distinct access privileges for Students (`/student/dashboard`) and Security Admins (`/admin/dashboard`).
- **💡 1-Click Demo Quick Switcher:** Built-in demo role toggles on login and navbar to effortlessly switch between Student and Admin views during live presentations.

---

## 🛠️ 3. Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, React Router v6, Lucide React Icons, Axios |
| **Backend** | Node.js, Express.js (MVC Architecture) |
| **Database** | MongoDB & Mongoose (with seamless In-Memory / LocalStorage Demo Fallback) |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing, CORS, protected route middleware |
| **Deployment / Scripts** | Windows batch scripts (`run-demo.bat`), Vite production bundler |

---

## 📸 4. Screenshots & Interface Preview

*(Screenshots can be added here or captured directly from http://localhost:5173)*

1. **Modern Hero Landing Page:** Metric cards, emergency hotlines, and feature highlights.
2. **Student Incident Submission:** Live AI classification box with confidence meter and 1-click "Apply AI Suggestion".
3. **SOS Distress Activation:** 5-second countdown radar with prototype safety disclaimers.
4. **Admin Command Operations Console:** Analytics charts, critical alert banners, and management table.
5. **Interactive 4-Phase Dispatch Stepper:** Reported → Assigned → Responding → Resolved.

---

## 🚀 5. Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ or v24+
- (Optional) MongoDB running locally on `localhost:27017` (If MongoDB is not installed, the platform automatically runs in In-Memory Demo Mode with zero configuration!)

### Option A: 1-Click Launch (Windows)
Double-click `run-demo.bat` in the `campussafe-ai/` root directory. This starts both backend and frontend servers in separate terminal windows.

### Option B: Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
*Backend runs at `http://localhost:5000` (Health check at `http://localhost:5000/api/health`)*

#### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 🔑 6. Demo Credentials (Hackathon Ready)

The application includes pre-configured demo credentials with 1-click autofill buttons:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@campus.com` | `student123` | Student Dashboard, Report Emergency, SOS Alert, My Reports |
| **Admin** | `admin@campus.com` | `admin123` | Admin Command Console, Assign Responders, Change Status, Resolve |

---

## 📡 7. API Endpoints

### Authentication
- `POST /api/auth/register` - Create student/admin account
- `POST /api/auth/login` - Authenticate credentials and retrieve JWT
- `GET /api/auth/me` - Retrieve current authenticated profile

### Incidents
- `POST /api/incidents` - Submit new emergency report
- `GET /api/incidents` - List all incidents (filters: `category`, `severity`, `priority`, `status`, `search`)
- `GET /api/incidents/:id` - Get specific incident dossier by ID
- `PUT /api/incidents/:id` - Update responder assignment, status, or append field notes
- `DELETE /api/incidents/:id` - Delete incident (Admin only)
- `POST /api/incidents/classify` - Run rule-based AI NLP classification on text

### Dashboard & Analytics
- `GET /api/dashboard/stats` - Retrieve aggregated incident counts, response times, and chart distributions

### Notifications
- `GET /api/notifications` - Retrieve alerts for current user
- `PUT /api/notifications/:id/read` - Mark single notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

---

## 📂 8. Folder Structure

```
campussafe-ai/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & graceful fallback
│   ├── controllers/
│   │   ├── authController.js     # Register, login, getMe
│   │   ├── incidentController.js # CRUD, triage, responder dispatch
│   │   ├── dashboardController.js# Stats and chart aggregations
│   │   └── notificationController.js # Read / mark alerts
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT & role verification
│   │   └── errorMiddleware.js    # Global error handlers
│   ├── models/
│   │   ├── User.js               # Mongoose User model
│   │   ├── Incident.js           # Mongoose Incident model
│   │   └── Notification.js       # Mongoose Notification model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incidentRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── aiClassifierService.js# Rule-based NLP classification
│   │   └── seedService.js        # Initial realistic dataset & mock store
│   ├── utils/
│   │   ├── generateId.js         # CSA-YYYY-XXXXX format generator
│   │   └── token.js              # JWT sign/verify
│   ├── server.js                 # Express server bootstrap
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, SOS pill, notifications
│   │   │   ├── Footer.jsx        # Campus safety hotlines & links
│   │   │   ├── NotificationDropdown.jsx # Real-time alerts panel
│   │   │   ├── AIClassificationBadge.jsx# Live NLP badge & 1-click apply
│   │   │   ├── StatusTimeline.jsx# 4-phase stepper component
│   │   │   ├── Charts.jsx        # SVG category, status & timeline graphs
│   │   │   ├── SOSCountdownModal.jsx    # 5-second distress activation
│   │   │   └── ProtectedRoutes.jsx      # Role guards
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero, metrics, 6-step flow, hotlines
│   │   │   ├── LoginPage.jsx     # 1-click demo logins & validation
│   │   │   ├── RegisterPage.jsx  # Student registration
│   │   │   ├── StudentDashboard.jsx     # Student reports & metrics
│   │   │   ├── AdminDashboard.jsx       # Command console, charts, table
│   │   │   ├── ReportIncidentPage.jsx   # AI-powered reporting form
│   │   │   ├── SOSPage.jsx       # Dedicated SOS emergency screen
│   │   │   ├── IncidentDetailsPage.jsx  # Full dossier & admin controls
│   │   │   └── IncidentTrackingPage.jsx # Public student tracking stepper
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with auto local fallback
│   │   │   └── aiClassifier.js   # Client-side NLP classifier
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── IncidentContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   └── idGenerator.js
│   │   ├── data/
│   │   │   └── demoData.js       # Preloaded realistic incidents
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .env.example
├── run-demo.bat                  # 1-click dual-server launcher
└── README.md
```

---

## ⏱️ 9. 3–5 Minute Hackathon Presentation Walkthrough

Follow this step-by-step walkthrough to give judges a flawless live demonstration:

1. **Step 1: Landing Page Overview (30s)**
   - Open `http://localhost:5173`.
   - Point out the headline: *"Safer Campus. Faster Response. Smarter Emergency Management."*
   - Highlight the **Average Response Time (3.8 mins)**, active incidents, and the **6-Step Automated Workflow**.

2. **Step 2: Student Login & Dashboard (45s)**
   - Click **Login** and press the **Student Demo** 1-click button (`student@campus.com`).
   - You land on the **Student Dashboard**, showing personal reports, live status tags, and emergency hotlines.

3. **Step 3: AI-Powered Emergency Report (60s)**
   - Click **Report Incident**.
   - In the description box, paste:
     > *"I can see smoke coming from the electronics laboratory."*
   - Notice the **AI Emergency Classification** panel immediately trigger:
     - **Suggested Category:** `Fire`
     - **Suggested Severity:** `Critical`
     - **Suggested Priority:** `Immediate`
     - **Confidence:** `98%`
   - Click **Apply AI Suggestion** to auto-populate the form.
   - Click **Dispatch Emergency Report Now**.
   - The confirmation modal displays the generated ID (e.g., `CSA-2026-00124`).

4. **Step 4: Real-time Admin Dispatch & Status Advancement (60s)**
   - Click the user profile icon in the Navbar and select the **Admin** Quick Role Switcher (or login with `admin@campus.com`).
   - On the **Campus Operations Console**, the new Fire incident appears at the top of the Critical alerts queue.
   - Click **Manage** on the incident.
   - In the **Admin Command Console**:
     - Assign responder: **Fire Response Team**
     - Change status: **Responding**
     - Add field note: *"Evacuation siren sounded. Hazmat team on scene."*
     - Click **Save Updates**.
   - Watch the 4-phase timeline update to **Responding**.

5. **Step 5: Incident Resolution & Student Notification (45s)**
   - Click **Mark Incident As Resolved**.
   - Switch back to the Student view (via Navbar Quick Switcher).
   - The student's dashboard displays the updated incident with green **Resolved** status, and the notification bell rings with an instant update alert!

6. **Step 6: SOS Emergency Trigger (30s)**
   - Click the red **SOS Alert** button in the header.
   - Demonstrate the 5-second countdown with the animated distress radar and Cancel / Send Now buttons.

---

## 🔮 10. Future Roadmap

- **🛰️ Automated Indoor Bluetooth Beacons:** Micro-location pinpointing inside high-rise campus buildings.
- **🎙️ Speech-to-Text Voice SOS:** Multilingual voice distress reporting for hands-free emergencies.
- **🤖 Autonomous Drone Fleet Dispatch:** Automated thermal imaging drone dispatch to verify outdoor fire or intrusion alerts before physical guards arrive.
- **📱 Native Mobile App:** React Native push notifications and lock-screen widget triggers.

---

## 🛡️ License
Distributed under the MIT License. Built for collegiate safety hackathons.
