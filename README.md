# ☀️ SolarLoop - Solar Panel Lifecycle Management System

A comprehensive web application for tracking, monitoring, and managing solar panel lifecycles with integrated recycler directory and admin management system.

## 🎯 Features

### For Users:
- ✅ User registration and authentication
- ✅ Solar panel tracking and management
- ✅ Lifecycle monitoring with expiry alerts
- ✅ Dashboard with statistics and analytics
- ✅ Access to verified recycler directory (login required)
- ✅ Email notifications for registration

### For Admins:
- ✅ Admin dashboard with system statistics
- ✅ View all registered users
- ✅ Monitor total panels in system
- ✅ User role management

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Test MongoDB connection
node test-mongodb.js

# Start the application
npm start

# Access at http://localhost:3000
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide for common tasks
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup and deployment instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete list of changes and features

## 🔧 Configuration

### Environment Variables (.env)
```env
MONGODB_URI=mongodb://localhost:27017/solar-recycle
SESSION_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

### MongoDB Setup
- **Local Development**: Use local MongoDB (default configuration)
- **Production (Render)**: Use MongoDB Atlas (update MONGODB_URI)

## 👤 Admin Management

### Create Admin User:
```bash
# 1. Register user through website
# 2. Run command:
node manage-admin.js set <username>

# 3. Login - will redirect to admin dashboard
```

### Remove Admin:
```bash
node manage-admin.js remove <username>
```

## 🎨 Key Changes from Original

### 1. Database Migration
- ❌ JSON file storage (users.json, panels.json)
- ✅ MongoDB with Mongoose ODM

### 2. Admin System
- ✅ Admin role field in user model
- ✅ Admin dashboard with statistics
- ✅ Automatic redirect based on role
- ✅ Command-line admin management tool

### 3. Protected Routes
- ✅ "Find Recyclers" requires login
- ✅ Hidden from navbar when logged out
- ✅ Redirects to login if accessed directly

### 4. Registration Flow
- ❌ Auto-login after registration
- ✅ Redirect to login page with success message

## 📁 Project Structure

```
jai-hanuman-solar-main/
├── models/
│   ├── UserMongo.js              # User model with admin field
│   └── SolarPanelMongo.js        # Solar panel model
├── routes/
│   └── index.js                  # All routes with MongoDB
├── templates/
│   ├── core/
│   │   ├── home.ejs
│   │   ├── dashboard.ejs
│   │   ├── admin_dashboard.ejs   # NEW: Admin dashboard
│   │   └── ...
│   ├── registration/
│   │   ├── login.ejs
│   │   └── register.ejs
│   └── layout.ejs                # Updated navbar
├── static/
│   ├── css/
│   └── images/
├── db.js                         # MongoDB connection
├── server.js                     # Express server
├── manage-admin.js               # NEW: Admin management tool
├── test-mongodb.js               # NEW: Connection test
├── .env                          # Environment variables
├── package.json
├── QUICKSTART.md                 # NEW: Quick reference
├── SETUP_GUIDE.md                # NEW: Setup instructions
└── IMPLEMENTATION_SUMMARY.md     # NEW: Complete changes list
```

## 🧪 Testing

### Test MongoDB Connection:
```bash
node test-mongodb.js
```

### Test Regular User:
1. Register at `/register`
2. Login at `/login`
3. Access dashboard
4. Add solar panels
5. View recycler directory

### Test Admin User:
1. Register user
2. Run `node manage-admin.js set <username>`
3. Login
4. Should redirect to admin dashboard
5. View all users and statistics

## 🚢 Deployment on Render

### Prerequisites:
1. MongoDB Atlas account and cluster
2. GitHub repository
3. Render account

### Steps:
1. **Setup MongoDB Atlas**
   - Create cluster
   - Create database user
   - Whitelist all IPs (0.0.0.0/0)
   - Get connection string

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy on Render**
   - Create new Web Service
   - Connect GitHub repo
   - Set environment variables
   - Deploy

4. **Set Admin User**
   - Use Render Shell
   - Run: `node manage-admin.js set <username>`

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

## 🔒 Security

- ✅ Password hashing with bcrypt
- ✅ Session-based authentication
- ✅ Protected routes with middleware
- ✅ Admin authorization checks
- ✅ MongoDB injection prevention

## 📊 Database Schema

### Users
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  created_at: Date
}
```

### Solar Panels
```javascript
{
  userId: ObjectId,
  brand: String,
  model: String,
  capacity_watts: Number,
  warranty_years: Number,
  installation_date: Date,
  location: String,
  serial_number: String,
  created_at: Date
}
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Template Engine**: EJS
- **Authentication**: bcryptjs, express-session
- **Email**: Nodemailer
- **Styling**: Custom CSS

## 📝 Scripts

```bash
npm start          # Start the server
npm run dev        # Start with nodemon (development)
npm run server     # Start server directly

node test-mongodb.js              # Test MongoDB connection
node manage-admin.js set <user>   # Make user admin
node manage-admin.js remove <user> # Remove admin
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Test connection
node test-mongodb.js

# Check if MongoDB is running (local)
# Verify connection string in .env
```

### Admin Not Working
```bash
# Re-run admin command
node manage-admin.js set <username>

# Clear browser cookies and login again
```

### Find Recyclers Still Visible
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

## 📞 Support

For detailed troubleshooting, see:
- [QUICKSTART.md](QUICKSTART.md) - Common tasks
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup issues
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Feature details

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

Built with ❤️ for sustainable solar panel lifecycle management.

---

**Ready for Render Deployment** ✅  
**MongoDB Integrated** ✅  
**Admin System** ✅  
**Protected Routes** ✅
