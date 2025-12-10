## 🛠️ Technology Stack

### Backend (Express.js + PostgreSQL)
- **Framework**: Express.js – Lightweight and flexible Node.js framework.
- **Database**: PostgreSQL and Prisma ORM 
- **Authentication & Security** JWT Authentication, Password Hashing, CORS Protection
- **File Uploads**: Multer – Handles avatar uploads and event image processing (disk storage)
- **Google Calendar Integration**: Googleapis – OAuth2 authentication + Calendar Events API for RSVP sync
- **Deployment**: Railway – Hosting for API server + PostgreSQL database

### Frontend (React + Vite + MUI)
- **Framework**: React 19
- **Build Tool**: Vite
- **UI & Styling**: Material UI (MUI v7), MUI Icons
- **Calendars & Scheduling**: FullCalendar – Event calendar rendering 
- **Forms & Notifications**: Notistack – Snackbar notifications
- **API & Networking**: Axios – HTTP client with interceptors for auth and error handling
- **Routing**: React Router v7 – Client-side routing for protected pages and role-based dashboards
- **Deployment**: Railway

### Production URLs
- **Frontend**: [https://csc309project-production-c129.up.railway.app]
- **Backend API**: [https://csc309project-production-17ba.up.railway.app]

### Demo Users
- **Superuser**: utorid: jasmin12
- **Manager**: utorid: bobbob12
- **Cashier**: utorid: cathy12
- **Regular User**: utorid: reeree12
- **Regular User**: utorid: rachel12, password
- The pwd for all demo users are Password123# 

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Git

### Local Development Setup
1. **Clone and navigate to backend directory:**
```bash
git clone https://github.com/Jasjas7777/CSC309_Project.git
cd CSC309_Project/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment configuration:**
```bash
# Create .env file with: 
JWT_SECRET="your-super-secure-jwt-secret-min-32-chars"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
REDIRECT=http://localhost:5173/redirect
FRONTEND_URL="http://localhost:5173"
```

4. **Start the server:**
```bash
npm start
```

Server runs on `http://localhost:3000

#### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd ../frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment configuration:**
```bash
# Create .env file with:
VITE_BACKEND_URL="http://localhost:3000"
```

4. **Start development server:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173``

### Production Deployment
#### Backend (Railway)
1. **Connect GitHub repository** 
2. **Set environment variables**:
    - `DATABASE_URL`: PostgreSQL connection string from Railway PostgreSQL plugin
    - `JWT_SECRET`: Secure JWT secret (32+ characters)
    - `FRONTEND_URL`: Your deployed frontend URL (for CORS)
    - `PORT`: Optional; default 8080 on Railway
    - `GOOGLE_CLIENT_ID`: From Google Cloud Console
    - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
    - `REDIRECT`: Backend OAuth callback
3. **Deploy**: Automatic deployment on push to main branch

#### Frontend (Railway)
1. **Connect GitHub repository** to Vercel
2. **Configure build settings**:
    - Framework: Vite
    - Root Directory: `frontend`
    - Build Command: `npm run build`
    - Start Command: `npx serve -s dist`
3. **Set environment variable**:
    - `VITE_BACKEND_URL`: The deployed backend URL
4. **Deploy**: Automatic deployment on push to main branch