# Readlexia - Dyslexia-Friendly Reading Platform

> A production-ready full-stack web application designed to make reading easier for people with dyslexia.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Readlexia
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

3. **Configure Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE readlexia;
```

4. **Configure Environment Variables**

Backend `.env`:
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=readlexia

JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_change_in_production_12345678

FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:3001
```

5. **Start the application**

**Option 1: Use batch file (Windows)**
```bash
start-app.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Open your browser**
```
http://localhost:5173
```

---

## ✨ Features

### Accessibility Features
- **Reading Ruler** - Customizable reading guide
- **Syllable Splitter** - Break words into syllables
- **Dyslexia-friendly fonts** - Optimized typography
- **Color Customization** - Custom background and text colors

### User Management
- Secure JWT authentication with bcrypt
- User profiles with reading preferences
- Session management

### Document Management
- Document library with CRUD operations
- Categories and organization
- Offline support with auto-sync

### Security
- XSS protection with DOMPurify
- SQL injection protection (TypeORM)
- Rate limiting
- Input validation
- CORS configuration

---

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite 6
- Tailwind CSS v4
- Axios
- Radix UI Components

### Backend
- NestJS 10
- MySQL with TypeORM
- JWT Authentication
- Passport
- bcrypt

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (returns JWT)
- `GET /auth/profile` - Get current user

### Documents  
- `GET /documents` - Get all documents
- `GET /documents/:id` - Get document by ID
- `POST /documents` - Create document
- `PATCH /documents/:id` - Update document
- `DELETE /documents/:id` - Delete document

### Users
- `GET /users/:id` - Get user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

---

## 🏗️ Project Structure

```
Readlexia/
├── backend/              # NestJS Backend
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── documents/   # Document management
│   │   ├── users/       # User management
│   │   └── common/      # Shared utilities
│   └── package.json
│
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── app/        # Application components
│   │   ├── services/   # API services
│   │   └── utils/      # Utilities
│   └── package.json
│
├── start-app.bat       # Windows startup script
└── README.md
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test                # Unit tests
npm run test:e2e       # E2E tests

# Frontend tests
cd frontend  
npm run test
```

---

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Deploy dist/ folder to hosting
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Configure database with SSL
- [ ] Set TypeORM `synchronize: false`
- [ ] Enable HTTPS
- [ ] Configure CORS whitelist
- [ ] Set up error monitoring
- [ ] Configure automated backups

---

## 📝 License

MIT License

---

## 🙏 Credits

**Original Design:** [Figma Wireframe](https://www.figma.com/design/umM4l9mjm3qvE3wsUepuQs/Dyslexia-Support-Website-Wireframe_)

---

**Ready to help people read better! 🚀**
