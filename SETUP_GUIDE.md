# SolarLoop - MongoDB Setup Guide

## Changes Implemented

### 1. MongoDB Integration
- Replaced JSON file storage with MongoDB
- All user and panel data now stored in MongoDB database
- Ready for deployment on Render with MongoDB Atlas

### 2. Admin Functionality
- Added admin role system
- Admin users are redirected to admin dashboard upon login
- Admin dashboard shows:
  - Total users and panels statistics
  - List of all registered users
  - User roles (Admin/User)
- Regular users cannot access admin dashboard

### 3. Protected Find Recycler
- "Find Recyclers" option hidden from navbar until user logs in
- Only authenticated users can access recycler directory

### 4. Registration Flow
- After registration, users are redirected to login page
- Users must login to access their dashboard

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure MongoDB

#### Option A: Local MongoDB (Development)
1. Install MongoDB locally
2. Your `.env` file is already configured for local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/solar-recycle
   ```

#### Option B: MongoDB Atlas (Production - Render)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/solar-recycle
   ```
6. Replace `username`, `password`, and cluster URL with your actual values

### Step 3: Start the Application
```bash
npm start
```

## Admin User Management

### Making a User Admin

1. First, register a user normally through the website
2. Then run this command to make them admin:
   ```bash
   node manage-admin.js set <username>
   ```
   Example:
   ```bash
   node manage-admin.js set john
   ```

3. Next time that user logs in, they will be redirected to the admin dashboard

### Removing Admin Privileges

To remove admin privileges from a user:
```bash
node manage-admin.js remove <username>
```

Example:
```bash
node manage-admin.js remove john
```

## Deployment on Render

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "MongoDB integration with admin functionality"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create MongoDB Atlas Database
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string

### Step 3: Deploy on Render
1. Go to https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `SESSION_SECRET`: A random secret key
   - `EMAIL_USER`: Your email
   - `EMAIL_PASS`: Your email app password
   - `PORT`: 3000

### Step 4: Set Up Admin User
After deployment:
1. Register a user through your deployed website
2. Connect to your Render service via SSH or use Render Shell
3. Run: `node manage-admin.js set <username>`

## Features

### For Regular Users:
- Register and login
- Add solar panels
- Track panel lifecycle
- View dashboard with statistics
- Access recycler directory (after login)

### For Admin Users:
- All regular user features
- Access to admin dashboard
- View all users and statistics
- Monitor total panels in system

## Security Notes

1. Admin status is stored in MongoDB
2. Admin routes are protected with middleware
3. Regular users cannot access admin dashboard
4. Passwords are hashed with bcrypt
5. Session-based authentication

## File Structure
```
├── models/
│   ├── UserMongo.js          # User model with admin field
│   └── SolarPanelMongo.js    # Solar panel model
├── routes/
│   └── index.js              # All routes with MongoDB integration
├── templates/
│   └── core/
│       └── admin_dashboard.ejs  # Admin dashboard view
├── db.js                     # MongoDB connection
├── server.js                 # Express server with MongoDB
├── manage-admin.js           # Admin management script
└── .env                      # Environment variables
```

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running (local)
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

### Admin Not Working
- Verify user exists in database
- Run `node manage-admin.js set <username>` again
- Check MongoDB for `isAdmin: true` field

### After Registration Not Redirecting to Login
- Clear browser cache and cookies
- Check server logs for errors

## Support

For issues or questions, check the console logs:
```bash
npm start
```

The logs will show:
- MongoDB connection status
- Email sending status
- Any errors that occur
