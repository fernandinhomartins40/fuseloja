# Reusable Backend API

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Express](https://img.shields.io/badge/Express-4+-lightgrey.svg)
![SQLite](https://img.shields.io/badge/SQLite-3+-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

A comprehensive, production-ready, and reusable backend API built with Node.js, Express, and TypeScript. This backend is designed to be plug-and-play for any project, providing a solid foundation with authentication, file management, real-time features, and more.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: Complete JWT-based auth system with refresh tokens
- **User Management**: Full CRUD operations with role-based access control
- **File Management**: Upload, processing, and storage with image optimization
- **Real-time Communication**: WebSocket support for live updates
- **Email System**: Template-based email service with development simulation
- **Audit Logging**: Complete activity tracking and security monitoring
- **Rate Limiting**: Advanced rate limiting with progressive penalties
- **API Documentation**: Auto-generated Swagger documentation
- **Health Monitoring**: Built-in health checks and monitoring endpoints

### Security Features
- **JWT with Refresh Tokens**: Secure authentication flow
- **Role-based Access Control**: Admin, User, Moderator roles
- **Rate Limiting**: Multiple strategies for different endpoints
- **Security Headers**: Helmet.js integration
- **Input Validation**: Joi-based validation
- **Password Security**: Bcrypt hashing with configurable rounds
- **CORS Protection**: Configurable origins

### Developer Experience
- **TypeScript**: Full type safety and IntelliSense
- **Hot Reload**: Development with live reloading
- **Docker Support**: Ready for containerization
- **GitHub Actions**: CI/CD pipeline included
- **Comprehensive Logging**: Structured logging with Winston
- **Error Handling**: Global error handling with custom error types
- **Code Quality**: ESLint configuration

## 📋 Prerequisites

- Node.js 18+ 
- npm 8+
- Docker (optional, for containerized development)

## 🛠️ Installation

### Quick Start

1. **Clone or copy the backend directory**
   ```bash
   cp -r backend/ your-project-backend/
   cd your-project-backend/
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev:ts
   ```

The API will be available at `http://localhost:3000` with documentation at `http://localhost:3000/api-docs`.

### Docker Development

```bash
# Start with Docker Compose
docker-compose up -d

# With monitoring (optional)
docker-compose --profile monitoring up -d

# With Redis caching (optional)
docker-compose --profile redis up -d
```

## ⚙️ Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1

# Database Configuration
DATABASE_URL=./database/app.db
DATABASE_BACKUP_PATH=./database/backups

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourapp.com

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# WebSocket Configuration
SOCKET_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | User login | No |
| POST | `/api/v1/auth/logout` | User logout | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| GET | `/api/v1/auth/me` | Get user profile | Yes |
| POST | `/api/v1/auth/change-password` | Change password | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/verify-email` | Verify email address | No |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | List users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | Owner/Admin |
| PUT | `/api/v1/users/:id` | Update user | Owner/Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |

### File Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/files/upload` | Upload file | Yes |
| POST | `/api/v1/files/avatar` | Upload avatar | Yes |
| GET | `/api/v1/files/:id` | Get file | Public/Owner |
| DELETE | `/api/v1/files/:id` | Delete file | Owner/Admin |

### Health & Monitoring

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| GET | `/api-docs` | API documentation | No |
| GET | `/swagger.json` | Swagger specification | No |

## 🏗️ Architecture

### Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Data models and database
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── app.ts             # Application entry point
├── uploads/               # File uploads
├── database/              # SQLite database
├── logs/                  # Application logs
├── .env.example           # Environment template
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Development compose
└── README.md              # This file
```

### Core Components

#### Authentication Flow
1. User registers/logs in
2. Server generates JWT access token + refresh token
3. Client stores tokens securely
4. Access token used for API requests
5. Refresh token used to get new access tokens
6. Rate limiting prevents abuse

#### Database Layer
- SQLite for simplicity and portability
- Automatic migrations on startup
- Better-sqlite3 for performance
- Connection pooling and optimization

#### File Management
- Local file storage with organized folders
- Image processing with Sharp
- Automatic thumbnail generation
- File type validation and size limits

#### WebSocket Integration
- Socket.io for real-time communication
- JWT authentication for sockets
- User-specific room management
- Automatic reconnection handling

## 🚀 Deployment

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment**
   ```bash
   NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t reusable-backend .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e JWT_SECRET=your-production-secret \
     reusable-backend
   ```

### VPS Deployment with GitHub Actions

1. **Set up secrets in GitHub repository:**
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: SSH username
   - `VPS_SSH_KEY`: Private SSH key
   - `VPS_PORT`: SSH port (default: 22)

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will automatically:
- Run tests and security scans
- Build Docker image
- Deploy to your VPS
- Verify deployment health
- Send notifications

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs
```bash
# View real-time logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

### Database Stats
Access via admin endpoints or directly check database size and table statistics.

## 🔧 Customization

### Adding New Endpoints

1. **Create controller in `src/controllers/`**
2. **Add routes in `src/routes/`**
3. **Register routes in `src/app.ts`**
4. **Add validation schemas if needed**

### Adding New Middleware

1. **Create middleware in `src/middleware/`**
2. **Apply globally in `src/app.ts` or per route**

### Database Schema Changes

1. **Add migration in `src/models/database.ts`**
2. **Update TypeScript types in `src/types/`**
3. **Restart application to apply migrations**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Available at `/api-docs` when running
- **Issues**: Create an issue for bug reports
- **Email**: Configure `EMAIL_FROM` for support emails

## 🔮 Roadmap

- [ ] GraphQL support
- [ ] Redis caching integration
- [ ] Advanced monitoring with Prometheus/Grafana
- [ ] Multi-tenant support
- [ ] Advanced file processing (video, documents)
- [ ] Background job processing
- [ ] API versioning
- [ ] Microservices architecture support

---

**Made with ❤️ for developers who want to focus on building features, not infrastructure.** 