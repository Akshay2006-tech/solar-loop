# Quick Start Guide

## 🚀 First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure MongoDB:**
   - For local development: MongoDB URI is already set in `.env`
   - For Render deployment: Update `MONGODB_URI` in `.env` with MongoDB Atlas connection string

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open browser: http://localhost:3000

## 👤 User Registration & Login

### Regular User Flow:
1. Go to http://localhost:3000
2. Click "Get Started" or "Login"
3. Register a new account
4. After registration, you'll be redirected to login page
5. Login with your credentials
6. You'll be redirected to user dashboard

### Admin User Flow:
1. First register as a regular user
2. Stop the server (Ctrl+C)
3. Run: `node manage-admin.js set <your-username>`
4. Start the server again: `npm start`
5. Login with your credentials
6. You'll be redirected to admin dashboard

## 🔧 Admin Management Commands

### Make a user admin:
```bash
node manage-admin.js set username
```

### Remove admin privileges:
```bash
node manage-admin.js remove username
```

## 📋 Key Features

### ✅ What's Changed:
- ✓ MongoDB integration (replaces JSON files)
- ✓ Admin role system
- ✓ Protected "Find Recyclers" (login required)
- ✓ Registration redirects to login page
- ✓ Admin dashboard with user statistics

### 🔒 Protected Routes:
- `/dashboard` - Requires login
- `/add-panel` - Requires login
- `/recycler-directory` - Requires login
- `/admin/dashboard` - Requires admin role

### 🌐 Public Routes:
- `/` - Home page
- `/awareness` - Awareness page
- `/login` - Login page
- `/register` - Registration page

## 🎯 Testing the Application

1. **Test Regular User:**
   - Register a new user
   - Login
   - Add solar panels
   - View dashboard
   - Access recycler directory

2. **Test Admin User:**
   - Make a user admin using `manage-admin.js`
   - Login with that user
   - Should redirect to admin dashboard
   - View all users and statistics

3. **Test Protected Routes:**
   - Logout
   - Try to access `/recycler-directory` - should redirect to login
   - Try to access `/dashboard` - should redirect to login
   - "Find Recyclers" should not appear in navbar

## 🚢 Deployment on Render

1. **Prepare MongoDB Atlas:**
   - Create account at mongodb.com/cloud/atlas
   - Create cluster
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0)

2. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy on Render:**
   - Connect GitHub repo
   - Set environment variables:
     - `MONGODB_URI`
     - `SESSION_SECRET`
     - `EMAIL_USER`
     - `EMAIL_PASS`
   - Deploy

4. **Set Admin User (on Render):**
   - Use Render Shell
   - Run: `node manage-admin.js set <username>`

## 📝 Environment Variables

Required for production:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/solar-recycle
SESSION_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

## 🐛 Troubleshooting

### MongoDB Connection Failed:
- Check if MongoDB is running (local)
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

### Admin Dashboard Not Accessible:
- Verify user has `isAdmin: true` in MongoDB
- Run `node manage-admin.js set <username>` again
- Clear browser cookies and login again

### Find Recyclers Still Visible When Logged Out:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

### Registration Not Redirecting to Login:
- Check server console for errors
- Verify MongoDB connection is working

## 📞 Support

Check logs for detailed error messages:
```bash
npm start
```

Look for:
- "MongoDB connected successfully" - Database is working
- "Welcome email sent successfully" - Email service is working
- Any error messages will appear in red
