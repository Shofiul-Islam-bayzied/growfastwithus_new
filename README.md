# GrowFastWithUs - Business Automation Website

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-13+-blue.svg)

A full-stack business automation website built with React, Node.js, and PostgreSQL. This application helps businesses automate their growth processes with AI-powered workflows and no-code solutions.

🌟 **Star this repository if you find it helpful!**

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS and Radix UI
- **WordPress Blog Integration**: Headless CMS with full blog functionality (search, categories, tags, pagination)
  - Demo mode with fallback content (works without WordPress)
  - Easy setup in under 10 minutes
  - Support for WordPress.com and self-hosted sites
- **Admin Dashboard**: Complete content management system
- **Lead Management**: Contact form and lead tracking
- **Template System**: Business automation templates
- **Analytics**: Performance tracking and insights
- **Email Campaigns**: Built-in email marketing tools
- **A/B Testing**: Conversion optimization features
- **Content Scheduling**: Automated content publishing
- **Backup System**: Data protection and recovery

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Clerk (optional)
- **Deployment**: Docker + Nginx + PM2

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+ (or cloud database)
- Git

## 🚀 Quick Deployments

### Option 1: EasyPanel Deployment (Recommended)

**Deploy to EasyPanel in under 10 minutes!**

1. **Install EasyPanel on your server:**
```bash
curl -sSL https://get.easypanel.io | sh
```

2. **Follow the EasyPanel Quick Start Guide:**
   - [📖 EasyPanel Quick Start Guide](docs/EASYPANEL_QUICKSTART.md)
   - Complete setup in under 10 minutes
   - Automatic SSL certificates
   - Built-in monitoring an backups

3. **Or use the automated setup:**
   - Create PostgreSQL database service
   - Create app service with Git repository
   - Set environment variables
   - Deploy with one click

**EasyPanel Benefits:**
- ✅ No server configuration required
- ✅ Automatic SSL certificates
- ✅ Built-in monitoring and backups
- ✅ One-click deployments
- ✅ Real-time logs

### Option 2: Automated Setup (Local Development)

**Windows:**
```bash
setup-local.bat
```

**Mac/Linux:**
```bash
chmod +x setup-local.sh
./setup-local.sh
```

### Option 3: Manual Setup

1. **Clone the repository**
```bash
git clone <your-repo-url> growfastwithus
cd growfastwithus
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
cp env.example .env
# Edit .env with your database credentials
```

4. **Set up database**
```bash
# Option A: Local PostgreSQL
sudo -u postgres createdb growfastwithus
sudo -u postgres createuser growfast
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE growfastwithus TO growfast;"

# Option B: Cloud database (Neon, Railway, Supabase, etc.)
# Update DATABASE_URL in .env file
```

5. **Run database migrations**
```bash
npm run db:push
```

6. **Start development server**
```bash
npm run dev
```

7. **Visit the application**
- Website: http://localhost:5000
- Admin Panel: http://localhost:5000/admin-login
- Default Admin: `growfast_admin` / `GrowFast2025!Admin`
- Blog: http://localhost:5000/blog (uses demo content until WordPress is configured)

8. **Optional: Configure WordPress Blog**
   - See [WordPress Setup Guide](docs/WORDPRESS_SETUP_GUIDE.md)
   - Configure in admin panel under WordPress Settings
   - Or leave as-is to use demo blog posts

## 🗄️ Database Setup Options

### Local PostgreSQL
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Cloud Databases (Recommended for production)

**Neon (Free tier available):**
1. Visit https://neon.tech
2. Create account and database
3. Copy connection string to `.env`

**Railway:**
1. Visit https://railway.app
2. Create PostgreSQL database
3. Copy connection string to `.env`

**Supabase:**
1. Visit https://supabase.com
2. Create project and database
3. Copy connection string to `.env`

## 🐳 Docker Deployment

### Quick Docker Setup
```bash
# Create environment file
cp env.example .env
# Edit .env with your settings

# Start with Docker Compose
docker-compose up -d

# Visit http://localhost
```

### Production Docker Setup
```bash
# Build and run
docker build -t growfastwithus .
docker run -p 3000:3000 --env-file .env growfastwithus
```

## 🚀 Production Deployment

### Option 1: EasyPanel (Recommended)

**Best for beginners and quick deployment:**
- [📖 EasyPanel Quick Start Guide](docs/EASYPANEL_QUICKSTART.md)
- [📖 EasyPanel Full Guide](docs/EASYPANEL_DEPLOY.md)
- [📚 All Documentation](docs/) - Complete documentation directory

### Option 2: VPS Deployment

1. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Database Setup**
```bash
sudo -u postgres createdb growfastwithus
sudo -u postgres createuser growfast
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE growfastwithus TO growfast;"
```

3. **Application Deployment**
```bash
# Clone repository
git clone <your-repo-url> /var/www/growfastwithus
cd /var/www/growfastwithus

# Install dependencies
npm install

# Build application
npm run build

# Set up environment
cp env.example .env
# Edit .env with production settings

# Run migrations
npm run db:push

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

4. **Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/growfastwithus
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/growfastwithus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Platform Deployments

**Vercel:**
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway deploy
```

**DigitalOcean App Platform:**
1. Connect GitHub repository
2. Configure environment variables
3. Deploy with one click

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Required In |
|----------|-------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string | All environments |
| `NODE_ENV` | Environment (`development` or `production`) | All environments |
| `SESSION_SECRET` | Session encryption secret (min 32 chars) | **Production** |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | **Production** |
| `FRONTEND_URL` | Frontend URL for password reset links | **Production** |

### Optional but Recommended

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `SMTP_HOST` | SMTP server hostname | - |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | Defaults provided |
| `COOKIE_SECURE` | Enable secure cookies (HTTPS) | `false` (set to `true` in production) |
| `COOKIE_SAME_SITE` | Cookie SameSite policy | `lax` (set to `strict` in production) |
| `CLERK_PUBLISHABLE_KEY` | Clerk auth public key | - |
| `CLERK_SECRET_KEY` | Clerk auth secret key | - |

**Security Note:** In production, the application validates that `SESSION_SECRET` and `JWT_SECRET` are at least 32 characters long and not weak/default values. The application will exit if these requirements are not met.

**Generate secure secrets:**
```bash
openssl rand -hex 32
```

## 📁 Project Structure

```
growfastwithus/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Node.js backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── shared/               # Shared code between client/server
│   └── schema.ts         # Database schema
├── migrations/           # Database migrations
├── dist/                # Built application
└── docs/                # Documentation
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Run database migrations |
| `npm run check` | TypeScript type checking |
| `npm run easypanel:deploy` | EasyPanel deployment script |

## 📚 Documentation

For detailed deployment guides and documentation, visit the [docs](docs/) directory:

| Your Situation | Recommended Guide | Time Needed |
|---------------|------------------|-------------|
| **First-time user, want easy deployment** | [EasyPanel QuickStart](docs/EASYPANEL_QUICKSTART.md) | 5-10 min |
| **Want to compare options first** | [Deployment Summary](docs/DEPLOYMENT_SUMMARY.md) | 5 min read |
| **Need detailed EasyPanel setup** | [EasyPanel Deploy](docs/EASYPANEL_DEPLOY.md) | 15-30 min |
| **Prefer manual/traditional setup** | [Quick Start](docs/QUICK_START.md) | 30-60 min |
| **Want to understand all files** | [Files Overview](docs/EASYPANEL_FILES_OVERVIEW.md) | 10 min read |

**💡 Recommended Path**: Start with [Deployment Summary](docs/DEPLOYMENT_SUMMARY.md) (5 min) → [EasyPanel QuickStart](docs/EASYPANEL_QUICKSTART.md) (10 min) → Total time to production: ~15 minutes ⚡

## 🔐 Security

- Change default admin password immediately
- Use strong session secrets
- Enable HTTPS in production
- Regular security updates
- Database backups

## ✅ Production Deployment Checklist

Before deploying to production, ensure the following:

### Critical Security Requirements

- [ ] **Environment Variables Set:**
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` - Valid PostgreSQL connection string
  - [ ] `SESSION_SECRET` - At least 32 characters (generate with `openssl rand -hex 32`)
  - [ ] `JWT_SECRET` - At least 32 characters (generate with `openssl rand -hex 32`)
  - [ ] `FRONTEND_URL` - Must use HTTPS (e.g., `https://yourdomain.com`)

- [ ] **Secrets Validation:**
  - [ ] All secrets are strong (not default/weak values)
  - [ ] No hardcoded credentials in code
  - [ ] Secrets are stored securely (environment variables, not in code)

- [ ] **SMTP Configuration (Recommended):**
  - [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` set for email features
  - [ ] Test email sending functionality

- [ ] **CORS Configuration:**
  - [ ] `ALLOWED_ORIGINS` set if using custom domains
  - [ ] Only trusted origins are allowed

### Application Configuration

- [ ] **Database:**
  - [ ] Database migrations run (`npm run db:push`)
  - [ ] Database connection tested
  - [ ] Backup strategy in place

- [ ] **Session Store:**
  - [ ] Using PostgreSQL session store (not memory store) for multi-instance deployments
  - [ ] Session persistence verified

- [ ] **HTTPS:**
  - [ ] SSL/TLS certificate configured
  - [ ] All cookies set to `secure: true` in production
  - [ ] `COOKIE_SECURE=true` in environment

- [ ] **Health Checks:**
  - [ ] Health check endpoint working (`/api/health`)
  - [ ] Monitoring/alerting configured

### Code Quality

- [ ] **Hardcoded Admin Disabled:**
  - [ ] Hardcoded admin fallback is disabled in production
  - [ ] All admin users created through proper registration

- [ ] **Error Handling:**
  - [ ] Error messages don't expose internal details
  - [ ] Proper error logging in place

- [ ] **Logging:**
  - [ ] Structured logging configured
  - [ ] Log aggregation/monitoring set up (optional but recommended)

### Testing

- [ ] **Functionality:**
  - [ ] All critical features tested
  - [ ] Admin authentication working
  - [ ] Email features tested (if configured)
  - [ ] WordPress integration tested (if configured)

### Deployment

- [ ] **Build:**
  - [ ] Application builds successfully (`npm run build`)
  - [ ] No build warnings/errors

- [ ] **Docker (if using):**
  - [ ] Docker image builds successfully
  - [ ] Health check configured correctly
  - [ ] Port configuration matches environment

- [ ] **Monitoring:**
  - [ ] Application logs accessible
  - [ ] Error tracking configured (optional)
  - [ ] Performance monitoring set up (optional)

### Post-Deployment

- [ ] **Verification:**
  - [ ] Application starts without errors
  - [ ] Environment validation passes
  - [ ] All endpoints responding correctly
  - [ ] Admin panel accessible and functional

- [ ] **Security:**
  - [ ] Default admin credentials changed
  - [ ] Strong passwords set for all admin users
  - [ ] Security headers verified (helmet.js)

**Note:** The application will automatically validate environment variables at startup and exit if critical variables are missing or invalid in production mode.

## 📊 Monitoring

- Health check: `GET /api/health`
- PM2 monitoring: `pm2 status`
- Logs: `pm2 logs` or `docker-compose logs`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Check the documentation in [docs/](docs/)
- Review deployment guides
- Open an issue for bugs
- Contact for custom development

---

**Happy coding! 🚀**
