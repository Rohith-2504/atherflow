# AetherFlow — AI-Powered Workflow Ingestion Hub

AetherFlow is a modern, responsive, and secure full-stack product marketing website for a SaaS workflow orchestration tool. It integrates a lead capture form that writes entries directly to a persistent local SQLite database.

## 🚀 Key Features

1. **Stunning UI/UX Design**: Interactive dark-themed layout built with HSL color variables, smooth transitions, glassmorphic panels, and custom typography (Outfit + Inter).
2. **Double-Layer Validation**: Client-side validation in React provides real-time warnings (regex checks for mobile formats and email validity), and matching server-side validations in Express secure the database.
3. **SQLite Database Inspector**: An interactive admin table rendered at the bottom of the lead section queries and displays stored submissions directly from the SQLite database.
4. **Monorepo Architecture**: Clean separation between the React client and the Express backend, running concurrently in development and serving unified static assets in production.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Vanilla CSS (Variables, Flexbox/Grid, Glassmorphic overlays) + Lucide Icons
- **Backend**: Node.js + Express
- **Database**: SQLite (via `better-sqlite3` native drivers)
- **Tooling**: `concurrently` (multi-process developer workspace), `nodemon` (hot reloading)

---

## 📂 Project Structure

```text
pmwlf/
├── package.json         # Root scripts to orchestrate client & server
├── README.md            # Project documentation
├── client/              # React frontend
│   ├── package.json
│   ├── vite.config.js   # Proxy configuration pointing to Express port 5000
│   ├── index.html       # Fonts (Outfit/Inter) and SEO meta tags
│   └── src/
│       ├── main.jsx     # DOM entrypoint
│       ├── App.jsx      # Aggregator of layout sections
│       ├── index.css    # Typography, global CSS variables, resets, and keyframes
│       └── components/  # Page components and individual stylesheets
│           ├── Navbar.jsx / Navbar.css
│           ├── Hero.jsx / Hero.css
│           ├── Features.jsx / Features.css
│           ├── Benefits.jsx / Benefits.css
│           ├── Pricing.jsx / Pricing.css
│           ├── Testimonials.jsx / Testimonials.css
│           ├── Faq.jsx / Faq.css
│           ├── LeadForm.jsx / LeadForm.css
│           └── Footer.jsx / Footer.css
└── server/              # Express backend
    ├── package.json
    ├── index.js         # REST endpoints, validations, and static assets server
    ├── db.js            # SQLite database initialization
    ├── test-db.js       # Script to verify SQLite CRUD execution
    └── data/
        └── submissions.db # Generated SQLite database file
```

---

## 💾 Database Schema

The database table `submissions` is automatically generated at start inside `server/data/submissions.db` using the following SQL parameters:

| Column Name | Data Type | Key Type | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key | `AUTOINCREMENT` | Unique identifier for each lead. |
| `full_name` | `TEXT` | - | `NOT NULL` | The full name of the user (2-100 chars). |
| `mobile_number` | `TEXT` | - | `NOT NULL` | Checked phone format (7-15 digits). |
| `email` | `TEXT` | - | `NOT NULL` | Checked standard email address format. |
| `city` | `TEXT` | - | `NOT NULL` | City name of the contact (2-50 chars). |
| `message` | `TEXT` | - | `NOT NULL` | Contact message (10-1000 chars). |
| `created_at` | `DATETIME` | - | `DEFAULT CURRENT_TIMESTAMP` | Submission timestamp in UTC. |

---

## 🛡️ Validation Constraints

### 1. Full Name
- Cannot be blank.
- Must be between `2` and `100` characters.
- Sanitized to match alphabetical characters, spaces, hyphens, and apostrophes only.

### 2. Mobile Number
- Regex matching: `/^\+?[0-9\s\-()]{7,20}$/`.
- Sanitized digit character count must be between `7` and `15` numbers.

### 3. Email Address
- Regex matching: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (Standard RFC 5322 structure check).

### 4. City
- Cannot be blank.
- Must be between `2` and `50` characters.

### 5. Message
- Cannot be blank.
- Must be between `10` and `1000` characters.

---

## 🚀 Setup and Run Instructions

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your system.

### 1. Install Dependencies
Run the command below in the project root folder. This will automatically install packages in the root, the `server/` directory, and the `client/` directory:
```bash
npm run install-all
```

### 2. Run Database Diagnostics (Optional)
To verify SQLite initialization and CRUD operations:
```bash
node server/test-db.js
```

### 3. Run Development Servers
Start both the React dev server (port 3000) and the Express backend (port 5000) concurrently:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal. Submitting forms will send requests to the Express port via Vite's proxy.

### 4. Build and Run Production Server
Compile the React files and boot the single-process Express production environment (which hosts the static bundle):
```bash
# Build Vite React client
npm run build

# Start Express server in production mode
npm start
```
Open [http://localhost:5000](http://localhost:5000) to access the production site.

---

## 🌐 Deployment Guidelines

### Server Hosting (Render, Railway, VPS)
To host AetherFlow on services like **Render** or **Railway**:
1. Connect your GitHub repository.
2. Set **Build Command** to: `npm run install-all && npm run build`
3. Set **Start Command** to: `npm start`
4. Set the environment variable `PORT` if needed (defaults to `5000`).
5. *Note*: Since SQLite writes to a local file, files on ephemeral servers will reset when the server restarts or redeploys. To make database records persistent on Render/Railway, attach a **Persistent Volume Mount** mapped to `/server/data` or connect a PostgreSQL database.

**Live URL**: [Add your live URL here after deploying]
