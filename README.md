# SkillSphere – Interactive Student Skill & Portfolio Tracker

SkillSphere is a full-stack MERN application engineered for university and college students to systematically manage, quantify, and showcase their technical proficiencies, course milestones, software projects, and professional credentials.

---

## Project Description

In modern college placements and software engineering recruiting, traditional resumes often fail to capture the evolving, hands-on progression of a student's technical growth. **SkillSphere** bridges this gap by functioning as a centralized personal development system.

Students can:
- Catalog technical proficiencies across core computing domains (Programming Languages, Web Development, Database Systems, Data Structures & Algorithms, Machine Learning, Tools, and Soft Skills).
- Log granular milestone progression with interactive visual steppers (0% to 100%).
- Track capstone projects with live repository and demo URLs.
- Maintain verified industrial and academic certifications with credential validation links.
- Generate a placement-ready, printable, and shareable personal portfolio that aggregates all competencies in an executive format.

---

## Objectives

- **Track technical and professional skills:** Catalog competencies across seven academic and industry-aligned domains.
- **Monitor learning progress:** Track real-time progress percentages and transitions between `Not Started`, `Learning`, and `Completed` statuses.
- **Organize skills into categories:** Distinguish frontend, backend, algorithms, databases, DevOps tools, and interpersonal leadership skills.
- **Manage projects and certifications:** Maintain full CRUD tracking for software prototypes, hackathon builds, and verified credentials.
- **Build a professional student portfolio:** Present a unified, shareable profile tailored for campus interviews and recruiter evaluations.

---

## Technologies Used

### Frontend
- **React.js (v18)** – Component-based Single Page Application architecture
- **JavaScript (ES6+)** – Modern syntax and modular programming
- **HTML5 & CSS3** – Semantic markup and custom responsive design system
- **React Router DOM (v6)** – Declarative client-side routing and protected routes
- **Axios** – HTTP client with bearer token interception and response handling
- **Recharts** – Interactive SVG analytics (bar charts, radial distributions, tooltips)
- **Lucide React** – Clean, modern UI icon set

### Backend
- **Node.js** – Asynchronous, event-driven runtime environment
- **Express.js** – RESTful API web framework, middleware pipeline, and route handlers
- **JSON Web Tokens (JWT)** – Stateless authentication and session security
- **bcryptjs** – One-way cryptographic password hashing

### Database
- **MongoDB** – Scalable NoSQL document database
- **Mongoose** – Object Data Modeling (ODM) with validation and relationship schemas

### Development & DevOps Tools
- **Visual Studio Code** – Integrated development environment
- **Git and GitHub** – Version control and collaborative code tracking
- **Postman** – REST API endpoint validation and testing
- **npm** – Package management and script automation
- **Concurrently** – Unified mono-repo dev script execution

---

## Features and Functionalities

### 1. Authentication & Security
- **Student Registration & Login:** Safe registration with institutional details (institution, department, expected graduation year).
- **Password Security:** Salted and hashed passwords using `bcryptjs` (salt rounds: 10).
- **JWT Protection:** Signed JWT tokens with 30-day validity, attached via HTTP `Authorization: Bearer <token>` headers.
- **Defensive Input Validation:** Format verification on emails and passwords before hitting the database.
- **Explicit CORS Control:** Dynamic whitelist preventing unauthorized origin spoofing; wildcards never paired with credentials.
- **One-Click Demo Access:** Pre-configured demo student credentials for immediate evaluation.
- **Protected Routing:** Route guards redirect unauthenticated sessions to `/login`.

### 2. Analytics Dashboard
- **KPI Summary Cards:** Total skills, mastered skills, overall proficiency percentage, and ongoing learning milestones.
- **Category-Wise Distribution:** Interactive Recharts Bar Chart illustrating total competencies and average progress per category.
- **Learning Phase Distribution:** Recharts Pie Chart segmenting skills into `Completed`, `Learning`, and `Not Started`.
- **Recently Updated Skills:** Chronological audit trail of latest modified competencies with direct progress indicators.

### 3. Skill Management & Categorization
- **Full CRUD:** Create, read, update, and delete technical skills.
- **Regex Character Safety:** Safe query escaping allowing symbols like `C++`, `C#`, and `.NET` without regular expression injection or syntax exceptions.
- **7 Industry Categories:**
  1. Programming Languages
  2. Web Development
  3. Database Management
  4. Data Structures and Algorithms
  5. Artificial Intelligence and Machine Learning
  6. Tools and Technologies
  7. Soft Skills
- **4 Proficiency Tiers:** Beginner, Intermediate, Advanced, Expert.
- **Automatic Status Synchronization:** 100% progress auto-promotes status to `Completed`; positive progress maps to `Learning`.

### 4. Interactive Progress Tracking
- **Dedicated Progress Board:** Visual progression bars for every tracked skill.
- **Incremental Steppers:** Fast `+5%` and `-5%` adjusters with immediate visual and database synchronization.
- **Status Filter Tabs:** Filter progression by `Ongoing Learning`, `Completed`, or `Not Started`.
- **Overall Mastery Index:** Visual aggregate bar measuring total curriculum completion.

### 5. Search, Filter, and Sort Engine
- **Debounced Search:** Smooth real-time search with `useDebounce` hook.
- **Multi-criteria Filtering:** Filter concurrently by category, proficiency tier, and learning status.
- **Flexible Sorting:** Sort alphabetically (A-Z / Z-A), by progress percentage (highest/lowest), or by recently updated.
- **One-Click Reset:** Quickly clear all active filters.

### 6. Project Management
- **Project Catalog:** Track personal, academic, and open-source applications.
- **Project Metadata:** Title, detailed description, technology stack tags, completion date, and featured status.
- **Actionable Links:** Direct links to GitHub source code and hosted live demonstrations.
- **Modal CRUD Operations:** Seamless modal dialogs for adding, editing, and deleting projects.

### 7. Certification Management
- **Credentials Vault:** Archive industrial licenses, cloud badges, and course certificates.
- **Issuing Details:** Organization name, issue date, and credential ID.
- **Verification Links:** External URLs enabling recruiters to verify credential authenticity.

### 8. Personal Placement Portfolio
- **Executive Student Banner:** Name, professional headline, bio, university, department, batch year, and social handles (GitHub, LinkedIn, Portfolio, Twitter).
- **Competency Breakdown:** Categorized skills with proficiency pills and progress bars.
- **Project Showcase:** Highlights featured software prototypes and tech stacks.
- **Verified Credentials:** Formal listing of certificates and verification URLs.
- **Print / PDF Export Ready:** Clean CSS media queries (`@media print`) designed for single-click printing or PDF resume export.

---

## Project Structure

```
SkillSphere/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── certifications/
│   │   │   │   ├── CertCard.jsx
│   │   │   │   └── CertModal.jsx
│   │   │   ├── common/
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── portfolio/
│   │   │   │   ├── PortfolioHeader.jsx
│   │   │   │   └── PortfolioSkills.jsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   └── ProjectModal.jsx
│   │   │   └── skills/
│   │   │       ├── SkillCard.jsx
│   │   │       ├── SkillFilterBar.jsx
│   │   │       └── SkillModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Certifications.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyProjects.jsx
│   │   │   ├── MySkills.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── ProfileSettings.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SkillProgress.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── certService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── projectService.js
│   │   │   └── skillService.js
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── certController.js
│   │   ├── dashboardController.js
│   │   ├── portfolioController.js
│   │   ├── projectController.js
│   │   └── skillController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Certification.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── certRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── projectRoutes.js
│   │   └── skillRoutes.js
│   ├── tests/
│   │   └── api.test.js
│   ├── utils/
│   │   └── seeder.js
│   ├── package.json
│   ├── server.js
│   └── .env.example
│
├── .gitignore
├── package.json
└── README.md
```

---

## REST API Overview

All private API routes require the header `Authorization: Bearer <jwt_token>`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server & Database connectivity health check |
| `POST` | `/api/auth/register` | Public | Register new student profile |
| `POST` | `/api/auth/login` | Public | Authenticate student and obtain JWT |
| `GET` | `/api/auth/me` | Private | Retrieve active student profile |
| `PUT` | `/api/auth/profile` | Private | Update student bio, institution, and links |
| `GET` | `/api/skills` | Private | Get skills (supports search, filter, sort) |
| `POST` | `/api/skills` | Private | Add new skill to portfolio |
| `GET` | `/api/skills/:id` | Private | Get skill details by ID |
| `PUT` | `/api/skills/:id` | Private | Update skill details |
| `PATCH`| `/api/skills/:id/progress` | Private | Update progress percentage (0 - 100) |
| `DELETE`| `/api/skills/:id` | Private | Delete skill from profile |
| `GET` | `/api/projects` | Private | List all student projects |
| `POST` | `/api/projects` | Private | Add new project |
| `PUT` | `/api/projects/:id` | Private | Update project details |
| `DELETE`| `/api/projects/:id` | Private | Delete project |
| `GET` | `/api/certifications` | Private | List all student certifications |
| `POST` | `/api/certifications` | Private | Add new certification |
| `PUT` | `/api/certifications/:id` | Private | Update certification |
| `DELETE`| `/api/certifications/:id` | Private | Delete certification |
| `GET` | `/api/dashboard/stats` | Private | Aggregate metrics for dashboard charts |
| `GET` | `/api/portfolio/me` | Private | Fetch complete portfolio package |
| `GET` | `/api/portfolio/public/:userId` | Public | Publicly accessible student portfolio |

---

## Database Overview & Schema Models

### 1. User Model (`User.js`)
- `name` (String, required): Student's full name.
- `email` (String, required, unique): Student's institutional email address.
- `password` (String, required, minlength: 6): Bcrypt hashed string.
- `headline` (String): Professional title.
- `bio` (String): Career summary.
- `institution` (String): College or university name.
- `department` (String): Academic department or major.
- `graduationYear` (String): Expected graduation year.
- `socialLinks` (Object): `{ github, linkedin, portfolio, twitter }`.
- `avatar` (String): Profile picture image URL.
- `timestamps`: `createdAt`, `updatedAt`.

### 2. Skill Model (`Skill.js`)
- `user` (ObjectId, ref: User, required, indexed): Owner of the skill.
- `name` (String, required): Skill name (e.g., React.js).
- `category` (String, required, enum): 7 standard categories.
- `proficiencyLevel` (String, required, enum): Beginner, Intermediate, Advanced, Expert.
- `progress` (Number, required, range 0–100): Numerical proficiency progress.
- `status` (String, required, enum): Not Started, Learning, Completed.
- `description` (String): Study notes or domain coverage.
- `timestamps`: `createdAt`, `updatedAt`.

### 3. Project Model (`Project.js`)
- `user` (ObjectId, ref: User, required, indexed): Owner student.
- `title` (String, required): Project headline.
- `description` (String, required): Problem description and solution.
- `technologies` (Array of Strings): Stack tags.
- `githubUrl` (String): Public repository link.
- `liveDemoUrl` (String): Deployment URL.
- `completionDate` (Date): Completion milestone.
- `featured` (Boolean): Highlight toggle for portfolio.
- `timestamps`: `createdAt`, `updatedAt`.

### 4. Certification Model (`Certification.js`)
- `user` (ObjectId, ref: User, required, indexed): Owner student.
- `name` (String, required): Certification name.
- `issuingOrganization` (String, required): Issuer (AWS, Meta, etc.).
- `issueDate` (Date, required): Date awarded.
- `credentialUrl` (String): External verification URL.
- `credentialId` (String): Credential license ID.
- `timestamps`: `createdAt`, `updatedAt`.

---

## Environment Configuration

### Backend (`server/.env.example`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:3000,http://localhost:5173
NODE_ENV=development
```

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port number for Express server | `5000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/skillsphere` |
| `JWT_SECRET` | Secret key for signing authentication tokens | String (minimum 32 characters in production) |
| `CLIENT_URL` | Comma-separated list of permitted frontend origins for CORS | `http://localhost:3000,http://localhost:5173` |
| `NODE_ENV` | Application runtime environment | `development` or `production` |

### Frontend (`client/.env.example`)
```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_URL` | Base REST API endpoint for frontend requests | `http://localhost:5000/api` |

---

## Installation and Execution Steps

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/skillsphere.git
cd skillsphere
```

---

### Step 2: Install All Dependencies
Install root, backend, and frontend packages with one command:
```bash
npm run install-all
```

---

### Step 3: Configure Environment Files
Copy the example environment files:
```bash
# Backend environment setup
cp server/.env.example server/.env

# Frontend environment setup
cp client/.env.example client/.env
```

---

### Step 4: Seed Database with Demo Records
Seed realistic sample student competencies across all 7 categories:
```bash
npm run seed
```

---

### Step 5: Start the Full-Stack Application
Start both backend Express server and Vite React frontend concurrently:
```bash
npm run dev
```

Alternatively, run in separate terminals:
- **Backend:** `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend:** `cd client && npm run dev` (Runs on `http://localhost:3000`)

---

### Step 6: Access the Application
Open your web browser and navigate to:
```
http://localhost:3000
```

#### Demo Student Credentials:
- **Email:** `student@skillsphere.edu`
- **Password:** `Password123!`
*(Or click the **One-Click Demo Login** button on the Login page).*

---

## Testing Instructions

### 1. Automated Backend & Security Test Suite
SkillSphere includes an automated test runner validating 18 critical test cases:
```bash
# Run from root
npm test

# Or run directly in server/
cd server
npm test
```

#### Verified Test Cases:
1. Health check response (`GET /api/health` returns status `ok` and `database: connected`).
2. Unauthorized access rejection (401 without Bearer token).
3. Malformed/tampered token rejection (401).
4. Defensive input validation (invalid email format returns 400).
5. Password length enforcement (< 6 characters returns 400).
6. User registration (returns 201 and JWT token).
7. Duplicate email prevention (returns 400).
8. Valid login authentication (returns 200 and JWT token).
9. Invalid login credentials rejection (returns 401).
10. Password omission security check (`/api/auth/me` never returns password hash).
11. Regex metacharacter safety in skill creation (`C++ (Modern)` escapes properly).
12. Duplicate skill name prevention (case-insensitive).
13. Quick progress update (`PATCH /api/skills/:id/progress` syncs progress and status).
14. Project CRUD operations.
15. Certification CRUD operations.
16. Dashboard statistics aggregation accuracy.
17. Consolidated portfolio package structure.
18. Test record teardown and cleanup.

### 2. Frontend Production Build Verification
To verify frontend bundling and zero compile-time errors:
```bash
npm run build
```

---

## Deployment Instructions

### 1. Database Deployment: MongoDB Atlas
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
2. Under **Security → Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud hosts.
3. Under **Security → Database Access**, create a database user with Read/Write privileges.
4. Click **Connect → Drivers (Node.js)** to copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillsphere?retryWrites=true&w=majority
   ```
5. Store this string securely as `MONGO_URI` on your hosting provider.

---

### 2. Backend Deployment: Render
1. Create a free account on [Render](https://render.com).
2. Click **New + → Web Service** and connect your GitHub repository.
3. Configure the service settings:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_random_64_char_secure_secret`
   - `CLIENT_URL`: `https://your-skillsphere-frontend.vercel.app`
5. Click **Create Web Service**. Your backend will be live at `https://your-service.onrender.com`.

---

### 3. Frontend Deployment: Vercel
1. Create a free account on [Vercel](https://vercel.com).
2. Click **Add New Project** and import your GitHub repository.
3. Set the project configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-service.onrender.com/api`
5. Click **Deploy**. Your student portfolio tracker will be live on Vercel.

---

## Team Members

| S. No. | Team Member Name | Registration Number |
|---|---|---|
| 1 | [Member 1 Name] | [Registration Number] |
| 2 | [Member 2 Name] | [Registration Number] |
| 3 | [Member 3 Name] | [Registration Number] |

---

## Future Enhancements

- **PDF Resume Builder:** Direct export to ATS-friendly single-page PDF resumes.
- **Skill Verification Badges:** Peer reviews or instructor endorsements for certified skills.
- **Placement Drive Tracker:** Kanban board tracking applications, campus interviews, and placement offers.
- **GitHub API Integration:** Automated repository syncing to import newly pushed student projects.
- **Dark / Light Mode Toggle:** User-customizable theme preferences.

---

## License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute this software for academic and professional purposes.
