# Achut's Legal Notebook - Admin Dashboard

A comprehensive legal blog platform with a secure, owner-only admin dashboard for content management and analytics.

## 🔐 Admin Dashboard Features

### Authentication & Security
- **Secure Login**: Owner-only access with strong password hashing
- **Session Management**: Configurable session duration with "Remember Me" option
- **Rate Limiting**: Brute force protection (5 attempts per 15 minutes)
- **CSRF Protection**: Built-in CSRF token validation
- **Route Guards**: All admin routes protected by authentication

### Dashboard Overview
- **Website Statistics**: Total articles, page views, and engagement metrics
- **Quick Actions**: Direct access to create articles, manage drafts
- **Recent Activity**: Timeline of system events and content updates
- **Performance Metrics**: Real-time analytics and trending content

### Content Management
- **Articles Management**: Full CRUD operations with advanced filtering
- **Article Creation & Editing**: Comprehensive forms with validation and slug management
- **Rich Text Editor**: Markdown-based editor with live preview
- **Draft System**: Save, edit, and publish workflow
- **Article Archiving**: Archive/unarchive articles with filtered views
- **Category & Tag Management**: Organize content with metadata
- **SEO Optimization**: Slug management and content validation

### Analytics Dashboard
- **Page View Tracking**: Daily and weekly traffic analysis
- **Interactive Charts**: Responsive charts using Recharts
- **Content Performance**: Top articles and engagement metrics
- **Category Distribution**: Visual breakdown of content organization

### Notifications System
- **System Alerts**: INFO, WARN, and ERROR notifications
- **Read/Unread Management**: Mark notifications and track status
- **Notification Viewing**: Modal view for desktop, dedicated page for mobile
- **Search & Filter**: Find notifications by type and content
- **Real-time Updates**: Dashboard badge showing unread count

### Settings & Administration
- **Profile Management**: Update email and username
- **Password Security**: Change passwords with validation
- **Storage Analytics**: View data usage and system statistics
- **System Reset**: Complete data reset functionality (danger zone)

## 🛣️ Admin Routes

### Core Dashboard
- `/admin` - Main dashboard overview
- `/admin/articles` - Articles management with filtering
- `/admin/drafts` - Draft articles management
- `/admin/notifications` - System notifications
- `/admin/analytics` - Performance metrics and charts
- `/admin/settings` - Profile and system settings

### Article Management
- `/admin/articles/new` - Create new article
- `/admin/articles/:id/edit` - Edit existing article
- `/admin/articles/new?status=DRAFT` - Create new draft

### Notification Details
- `/admin/notifications/:id` - View notification details (mobile-optimized)

## 🚀 Quick Start

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation & Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Default Admin Credentials

**⚠️ IMPORTANT: Change these credentials after first login**

```
Username: admin
Password: admin123!
Email: admin@achutslegal.com
```

### Admin Access
- Navigate to `/admin/login` to access the admin dashboard
- Use default credentials for first login
- Change credentials in Settings > Security tab

## 🎨 Environment Configuration

### Environment Variables (Optional)
```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-secure-password
```

### Data Storage
- **Development**: Uses localStorage for data persistence
- **Production Ready**: Easy migration to backend databases
- **Backup**: Export/import functionality for data management

## ✨ Recent Features (feat/admin-actions)

### Article Management Enhancements
- **Smart Routing**: New Article CTAs route to `/admin/articles/new`, Draft CTAs to `/admin/articles/new?status=DRAFT`
- **Comprehensive Forms**: Article creation/editing with validation, slug generation, and rich text editing
- **Archive System**: Archive/unarchive articles with proper analytics exclusion
- **Enhanced Filtering**: Filter by status (All, Published, Drafts, Archived) and category

### Notification System Improvements
- **Flexible Viewing**: Desktop modal + mobile page view for notifications
- **Real-time Updates**: Unread badge updates and status changes
- **Enhanced Actions**: Mark as read/unread, delete with confirmation dialogs

### Analytics & Data
- **Archived Articles Metric**: New analytics card showing archived content count
- **Improved Filtering**: Public site excludes archived articles
- **Data Migration**: Automatic migration of existing articles to support archiving

### Technical Improvements
- **Type Safety**: Enhanced TypeScript interfaces with new fields
- **Performance**: Optimized React Hook dependencies and component rendering
- **Build Success**: Production build verified and working
- **Non-Destructive**: All existing functionality preserved

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx      # Main admin shell with navigation
│   │   └── RichTextEditor.tsx   # Markdown editor component
│   └── ui/                      # Shadcn UI components
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── hooks/
├── lib/
│   ├── auth.ts                  # Authentication service
│   ├── storage.ts               # Data layer abstraction
│   ├── seed.ts                  # Data migration and seeding
│   └── types.ts                 # TypeScript definitions
├── pages/
│   ├── AdminLogin.tsx           # Login page
│   ├── AdminOverview.tsx        # Dashboard home
│   ├── AdminArticles.tsx        # Articles management
│   ├── AdminDrafts.tsx          # Drafts management
│   ├── AdminNotifications.tsx   # Notifications system
│   ├── AdminAnalytics.tsx       # Analytics dashboard
│   └── AdminSettings.tsx        # Settings and profile
└── __tests__/                   # Test suites
```

## 🧪 Testing

### Run Tests
```sh
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

### Test Coverage
- **Authentication**: Login, logout, session management
- **Storage Layer**: CRUD operations, data persistence
- **Admin Workflow**: Complete e2e admin functionality
- **Security**: Rate limiting, CSRF protection, validation

## 🔧 Available Scripts

```sh
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:e2e     # Run e2e tests
npm run lint         # Run ESLint
```

## 🗺️ Admin Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/admin/login` | Admin login page | Public |
| `/admin` | Dashboard overview | Protected |
| `/admin/notifications` | Notifications management | Protected |
| `/admin/articles` | Articles management | Protected |
| `/admin/drafts` | Drafts management | Protected |
| `/admin/analytics` | Analytics dashboard | Protected |
| `/admin/settings` | Settings and profile | Protected |

## 🛡️ Security Features

- **Password Hashing**: SHA-256 with salt (ready for bcrypt/Argon2)
- **Session Security**: Secure token generation and validation
- **Rate Limiting**: Login attempt throttling
- **CSRF Protection**: Token-based request validation
- **Input Validation**: Zod schema validation throughout
- **XSS Protection**: Sanitized output rendering
- **Route Protection**: Authentication required for admin access

## 📊 Data Management

### Migration from Static Data
The system automatically migrates existing static articles to the admin system on first run.

### Backup and Restore
- **Export**: Download all data as JSON
- **Import**: Upload and restore from backup
- **Reset**: Complete system reset option

### Data Validation
- **Slug Uniqueness**: Prevents duplicate article URLs
- **Content Validation**: Required fields and format checking
- **Image Handling**: Support for cover images and media

## 🎯 Deployment

### Build for Production
```sh
npm run build
```

### Environment Setup
1. Set up environment variables for production
2. Configure database connections (when migrating from localStorage)
3. Set up SSL certificates
4. Configure domain and hosting

### Migration to Backend
The current localStorage implementation provides a foundation for easy migration to:
- **Databases**: PostgreSQL, MySQL, MongoDB
- **Authentication**: JWT, OAuth, Auth0
- **File Storage**: AWS S3, Cloudinary
- **Analytics**: Google Analytics, custom tracking

## 🔄 Rollback Plan

### Feature Rollback
```sh
# Return to main branch
git checkout main

# Or rollback specific commits
git revert <commit-hash>
```

### Data Rollback
1. **Backup Current Data**: Use Settings > System > Export
2. **Disable Admin Features**: Update routing in App.tsx
3. **Restore Previous State**: Import previous backup
4. **Verify Functionality**: Run full test suite

### Emergency Procedures
1. **Complete Reset**: Settings > System > Reset All Data
2. **Credential Recovery**: Use default credentials
3. **Data Recovery**: Restore from latest backup

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6
- **State Management**: React Query + Context API
- **Testing**: Vitest + Playwright
- **Build**: Vite with TypeScript

## 📚 Additional Resources

- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes following existing patterns
3. Add tests for new functionality
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

## 📞 Support

For technical support or questions about the admin dashboard:
1. Check existing documentation
2. Review test cases for examples
3. Examine component implementations
4. Test locally before deployment

---

**Made with ❤️ for efficient legal content management**

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6bb42ea6-ab66-45f0-b77b-6f8bf351f0e1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
