# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `node test-mongodb.js` - MongoDB connects
- [ ] Run `npm start` - Server starts without errors
- [ ] Access http://localhost:3000 - Home page loads
- [ ] Register a new user - Success
- [ ] Redirected to login page after registration
- [ ] Login with new user - Success
- [ ] Redirected to user dashboard
- [ ] "Find Recyclers" visible in navbar (after login)
- [ ] Can access recycler directory
- [ ] Can add solar panel
- [ ] Dashboard shows panel statistics
- [ ] Logout works
- [ ] "Find Recyclers" hidden in navbar (after logout)
- [ ] Cannot access `/recycler-directory` when logged out
- [ ] Cannot access `/dashboard` when logged out

### Admin Testing
- [ ] Register a test user
- [ ] Run `node manage-admin.js set <username>`
- [ ] Command shows success message
- [ ] Login with admin user
- [ ] Redirected to admin dashboard (not user dashboard)
- [ ] Admin dashboard shows total users count
- [ ] Admin dashboard shows total panels count
- [ ] Admin dashboard shows list of users
- [ ] Can access user dashboard from admin dashboard
- [ ] Run `node manage-admin.js remove <username>`
- [ ] Login again - redirected to user dashboard (not admin)

---

## 🌐 MongoDB Atlas Setup

### Account Setup
- [ ] Created MongoDB Atlas account
- [ ] Email verified
- [ ] Logged into Atlas dashboard

### Cluster Setup
- [ ] Created free cluster (M0)
- [ ] Cluster is active and running
- [ ] Noted cluster name

### Database User
- [ ] Created database user
- [ ] Noted username
- [ ] Noted password
- [ ] User has read/write permissions

### Network Access
- [ ] Added IP address: 0.0.0.0/0 (allow all)
- [ ] Access list updated

### Connection String
- [ ] Clicked "Connect" on cluster
- [ ] Selected "Connect your application"
- [ ] Copied connection string
- [ ] Replaced `<password>` with actual password
- [ ] Replaced `<dbname>` with `solar-recycle`
- [ ] Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/solar-recycle`

---

## 📦 GitHub Setup

### Repository
- [ ] Created GitHub repository
- [ ] Repository is public or private (your choice)
- [ ] Noted repository URL

### Push Code
- [ ] Run `git init` in project folder
- [ ] Run `git add .`
- [ ] Run `git commit -m "Initial commit"`
- [ ] Run `git remote add origin <repo-url>`
- [ ] Run `git push -u origin main`
- [ ] Code visible on GitHub

### Verify Files
- [ ] All files pushed to GitHub
- [ ] `.env` file NOT pushed (should be in .gitignore)
- [ ] `node_modules/` NOT pushed

---

## 🚢 Render Deployment

### Account Setup
- [ ] Created Render account
- [ ] Email verified
- [ ] Logged into Render dashboard

### Create Web Service
- [ ] Clicked "New +" → "Web Service"
- [ ] Connected GitHub account
- [ ] Selected repository
- [ ] Repository connected successfully

### Configure Service
- [ ] Name: `solarloop` (or your choice)
- [ ] Region: Select closest to you
- [ ] Branch: `main`
- [ ] Root Directory: (leave blank)
- [ ] Runtime: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: Free

### Environment Variables
- [ ] Added `MONGODB_URI` = Your MongoDB Atlas connection string
- [ ] Added `SESSION_SECRET` = Random secret key (e.g., `solar-loop-secret-2024-xyz`)
- [ ] Added `EMAIL_USER` = Your Gmail address
- [ ] Added `EMAIL_PASS` = Your Gmail app password
- [ ] Added `PORT` = `3000`
- [ ] All variables saved

### Deploy
- [ ] Clicked "Create Web Service"
- [ ] Deployment started
- [ ] Build logs show no errors
- [ ] Deployment successful
- [ ] Service is "Live"
- [ ] Noted service URL (e.g., `https://solarloop.onrender.com`)

---

## 🧪 Production Testing

### Basic Functionality
- [ ] Access your Render URL
- [ ] Home page loads correctly
- [ ] CSS and images load
- [ ] "Find Recyclers" NOT visible (logged out)
- [ ] Click "Get Started" or "Login"
- [ ] Register page loads
- [ ] Register a new user
- [ ] Redirected to login page
- [ ] Success message displayed
- [ ] Login with new credentials
- [ ] Redirected to dashboard
- [ ] "Find Recyclers" NOW visible
- [ ] Can access recycler directory
- [ ] Can add solar panel
- [ ] Panel appears in dashboard
- [ ] Statistics update correctly
- [ ] Logout works

### Admin Setup (Production)
- [ ] Register a user for admin
- [ ] Open Render dashboard
- [ ] Go to your service
- [ ] Click "Shell" tab
- [ ] Run: `node manage-admin.js set <username>`
- [ ] Success message shown
- [ ] Close shell
- [ ] Login with admin user on website
- [ ] Redirected to admin dashboard
- [ ] Admin dashboard shows correct data
- [ ] Can view all users
- [ ] Can access user dashboard too

### Email Testing
- [ ] Register new user
- [ ] Check email inbox
- [ ] Welcome email received
- [ ] Email content correct

---

## 🔍 Final Verification

### Security
- [ ] Cannot access admin dashboard as regular user
- [ ] Cannot access dashboard when logged out
- [ ] Cannot access recycler directory when logged out
- [ ] Passwords are hashed (check MongoDB)
- [ ] Session expires after logout

### Performance
- [ ] Pages load quickly
- [ ] No console errors in browser
- [ ] No errors in Render logs
- [ ] MongoDB queries are fast

### Data Integrity
- [ ] Users saved correctly in MongoDB
- [ ] Panels saved correctly in MongoDB
- [ ] User-panel relationships work
- [ ] Admin flag persists

---

## 📝 Post-Deployment

### Documentation
- [ ] Updated README with production URL
- [ ] Documented admin credentials (securely)
- [ ] Noted MongoDB Atlas cluster details

### Monitoring
- [ ] Bookmarked Render dashboard
- [ ] Bookmarked MongoDB Atlas dashboard
- [ ] Set up email notifications (optional)

### Backup
- [ ] Noted all environment variables
- [ ] Saved MongoDB connection string securely
- [ ] Backed up admin credentials

---

## 🎉 Success Criteria

All of these should be true:
- ✅ Application accessible via Render URL
- ✅ Users can register and login
- ✅ Registration redirects to login page
- ✅ "Find Recyclers" hidden until login
- ✅ Dashboard works correctly
- ✅ Admin system functional
- ✅ MongoDB storing data correctly
- ✅ No errors in production logs

---

## 🆘 If Something Goes Wrong

### Deployment Failed
1. Check Render build logs
2. Verify all dependencies in package.json
3. Check Build Command is `npm install`
4. Check Start Command is `npm start`

### MongoDB Connection Error
1. Verify MONGODB_URI in Render environment variables
2. Check MongoDB Atlas network access (0.0.0.0/0)
3. Verify database user credentials
4. Test connection string format

### Admin Not Working
1. Use Render Shell to run manage-admin.js
2. Verify user exists in MongoDB
3. Check MongoDB for isAdmin field
4. Clear browser cookies and login again

### Find Recyclers Still Visible
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check layout.ejs was deployed correctly

### Email Not Sending
1. Verify EMAIL_USER and EMAIL_PASS in Render
2. Check Gmail app password is correct
3. Verify 2FA is enabled on Gmail
4. Check Render logs for email errors

---

## 📞 Quick Commands

```bash
# Test locally
npm start

# Test MongoDB
node test-mongodb.js

# Make user admin (local)
node manage-admin.js set username

# Make user admin (Render Shell)
node manage-admin.js set username

# Remove admin
node manage-admin.js remove username

# View logs (Render)
# Go to Render Dashboard → Your Service → Logs
```

---

## ✅ Completion

When all checkboxes are checked, your deployment is complete! 🎉

Your SolarLoop application is now:
- ✅ Running on Render
- ✅ Connected to MongoDB Atlas
- ✅ Admin system functional
- ✅ Protected routes working
- ✅ Ready for users!
