# TaskForge

> **A production-grade collaborative task management platform for modern engineering teams**

TaskForge is a full-stack SaaS application built with modern technologies, featuring real-time collaboration, role-based access control, and an intuitive user experience. This project demonstrates professional software engineering practices and scalable architecture.

![TaskForge Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=TaskForge+-+Collaborative+Task+Management)

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 👥 **Team Collaboration** - Multi-user projects with role-based permissions
- 📋 **Task Management** - Create, assign, and track tasks with priorities and due dates
- 🎯 **Kanban Board** - Visual task organization with drag-and-drop (planned)
- 📊 **Analytics Dashboard** - Real-time project metrics and productivity insights
- 🔔 **Activity Feed** - Track all project activities in real-time
- 🎨 **Custom Project Colors** - Personalize projects with color coding
- 🔍 **Advanced Filtering** - Filter tasks by status, priority, assignee, and search

### User Experience
- ⚡ **Lightning Fast** - Optimized performance with React Query caching
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎭 **Smooth Animations** - Polished UI with Framer Motion
- 🌈 **Modern Design** - Clean, professional interface inspired by Linear and Notion
- ♿ **Accessible** - Built with accessibility best practices

### Technical Highlights
- 🏗️ **Clean Architecture** - Separation of concerns with service/repository layers
- 🔒 **Security First** - Input validation, rate limiting, and SQL injection prevention
- 📦 **Type Safety** - End-to-end TypeScript for reliability
- 🧪 **Production Ready** - Error handling, logging, and deployment configuration
- 🚀 **Scalable** - Designed to handle growth with proper indexing and optimization

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## 📁 Project Structure

```
taskforge/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Seed data
│   └── src/
│       ├── config/                # Configuration files
│       ├── controllers/           # Request handlers
│       ├── middleware/            # Express middleware
│       ├── repositories/          # Data access layer
│       ├── routes/                # API routes
│       ├── services/              # Business logic
│       ├── types/                 # TypeScript types
│       ├── utils/                 # Utility functions
│       ├── validations/           # Zod schemas
│       └── index.ts               # Server entry point
│
└── frontend/
    └── src/
        ├── api/                   # API client functions
        ├── components/            # Reusable UI components
        ├── features/              # Feature-specific components
        ├── forms/                 # Form components
        ├── hooks/                 # Custom React hooks
        ├── layouts/               # Layout components
        ├── pages/                 # Page components
        ├── store/                 # Zustand stores
        ├── types/                 # TypeScript types
        ├── utils/                 # Utility functions
        ├── constants/             # App constants
        ├── App.tsx                # App component
        └── main.tsx               # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd taskforge
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/taskforge"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with demo data
npm run prisma:seed
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env

# Update .env if needed
# VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start Backend** (in `backend/` directory)
```bash
npm run dev
```
Server runs on http://localhost:5000

2. **Start Frontend** (in `frontend/` directory)
```bash
npm run dev
```
App runs on http://localhost:5173

3. **Access the Application**
- Open http://localhost:5173
- Login with demo account:
  - Email: `admin@taskforge.com`
  - Password: `password123`

## 🌐 Deployment

### Railway Deployment

#### Backend Deployment

1. **Create Railway Project**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd backend
railway init
```

2. **Add PostgreSQL Database**
- Go to Railway dashboard
- Click "New" → "Database" → "PostgreSQL"
- Copy the DATABASE_URL from the database settings

3. **Configure Environment Variables**
```bash
railway variables set JWT_SECRET="your-production-secret"
railway variables set NODE_ENV="production"
railway variables set FRONTEND_URL="https://your-frontend-url.railway.app"
```

4. **Deploy Backend**
```bash
railway up
```

#### Frontend Deployment

1. **Update API URL**
```bash
# In frontend/.env
VITE_API_URL=https://your-backend-url.railway.app/api
```

2. **Deploy Frontend**
```bash
cd frontend
railway init
railway up
```

3. **Update CORS**
- Update backend FRONTEND_URL environment variable with your deployed frontend URL

### Environment Variables

#### Backend
```env
DATABASE_URL=postgresql://user:password@host:5432/taskforge
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

#### Frontend
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST `/api/auth/login`
Login to existing account
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication)

### Project Endpoints

#### GET `/api/projects`
Get all projects for current user

#### POST `/api/projects`
Create a new project
```json
{
  "name": "Project Name",
  "description": "Project description",
  "color": "#6366f1"
}
```

#### GET `/api/projects/:id`
Get project by ID

#### PATCH `/api/projects/:id`
Update project

#### DELETE `/api/projects/:id`
Delete project

#### POST `/api/projects/:id/members`
Add team member to project

#### DELETE `/api/projects/:id/members/:userId`
Remove team member from project

### Task Endpoints

#### GET `/api/tasks/project/:projectId`
Get tasks for a project (supports filtering and pagination)

Query parameters:
- `status` - Filter by status (TODO, IN_PROGRESS, COMPLETED)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `assigneeId` - Filter by assignee
- `search` - Search in title and description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### POST `/api/tasks`
Create a new task

#### PATCH `/api/tasks/:id`
Update task

#### DELETE `/api/tasks/:id`
Delete task

#### GET `/api/tasks/project/:projectId/stats`
Get task statistics for a project

### Activity Endpoints

#### GET `/api/activities/recent`
Get recent activities for current user

#### GET `/api/activities/project/:projectId`
Get activities for a specific project

## 🎨 Design Philosophy

TaskForge follows modern SaaS design principles:

- **Minimalist** - Clean, uncluttered interface
- **Consistent** - Uniform spacing, colors, and components
- **Intuitive** - Self-explanatory UI with clear actions
- **Responsive** - Adapts seamlessly to all screen sizes
- **Accessible** - WCAG compliant with keyboard navigation
- **Performant** - Optimized for speed and efficiency

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **Rate Limiting** - Prevent brute force attacks
- **CORS Protection** - Configured origin restrictions
- **Helmet Security Headers** - XSS, clickjacking protection
- **Role-Based Access Control** - Admin and member permissions

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 📈 Future Enhancements

- [ ] Drag-and-drop Kanban board
- [ ] Real-time updates with WebSockets
- [ ] File attachments for tasks
- [ ] Task comments and discussions
- [ ] Email notifications
- [ ] Calendar view
- [ ] Time tracking
- [ ] Advanced analytics and reporting
- [ ] Mobile apps (React Native)
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Export to CSV/PDF
- [ ] Integration with Slack, GitHub, etc.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by a passionate developer

## 🙏 Acknowledgments

- Design inspiration from Linear, Notion, and Vercel
- Icons from Heroicons
- Avatars from DiceBear

---

**Note**: This is a portfolio/demonstration project showcasing modern full-stack development practices. It's designed to be production-ready and suitable for real-world use cases.
