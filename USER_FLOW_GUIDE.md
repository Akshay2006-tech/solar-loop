# 🎯 User Flow Guide

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     SolarLoop Platform                       │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   MongoDB    │◄────────┤  Express.js  │                 │
│  │   Database   │         │    Server    │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                    ┌──────────────┼──────────────┐          │
│                    │              │              │          │
│              ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐   │
│              │   Users   │  │  Panels │  │  Recyclers│   │
│              │Collection │  │Collection│  │ Directory │   │
│              └───────────┘  └─────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 Regular User Flow

### Registration & Login
```
1. Visit Homepage
   │
   ├─► Click "Get Started" or "Login"
   │
   ├─► Click "Register"
   │
   ├─► Fill Registration Form
   │   ├─ Username
   │   ├─ Email
   │   └─ Password
   │
   ├─► Submit Form
   │
   ├─► ✅ Account Created
   │
   ├─► 📧 Welcome Email Sent
   │
   ├─► 🔄 Redirected to Login Page
   │
   ├─► Enter Credentials
   │
   ├─► Submit Login
   │
   └─► ✅ Redirected to User Dashboard
```

### Dashboard Usage
```
User Dashboard
   │
   ├─► View Statistics
   │   ├─ Total Panels
   │   ├─ Safe Panels
   │   ├─ Near Expiry
   │   ├─ Expired Panels
   │   └─ Total Waste
   │
   ├─► Add New Panel
   │   ├─ Brand
   │   ├─ Model
   │   ├─ Capacity (watts)
   │   ├─ Installation Date
   │   ├─ Location
   │   └─ Serial Number
   │
   ├─► View Panel List
   │   └─ Delete Panel (if needed)
   │
   ├─► Access Find Recyclers
   │   └─ View Recycler Directory
   │
   └─► Logout
```

---

## 🔐 Admin User Flow

### Becoming Admin
```
1. Register as Regular User
   │
   ├─► Login to verify account works
   │
   ├─► Logout
   │
   ├─► Administrator runs command:
   │   └─ node manage-admin.js set <username>
   │
   └─► ✅ User is now Admin
```

### Admin Login & Dashboard
```
Admin Login
   │
   ├─► Enter Credentials
   │
   ├─► Submit Login
   │
   ├─► ✅ System detects isAdmin = true
   │
   └─► 🔄 Redirected to Admin Dashboard (not user dashboard)

Admin Dashboard
   │
   ├─► View System Statistics
   │   ├─ Total Users Count
   │   └─ Total Panels Count
   │
   ├─► View All Users Table
   │   ├─ Username
   │   ├─ Email
   │   ├─ Role (Admin/User)
   │   └─ Registration Date
   │
   ├─► Access User Dashboard
   │   └─ Click "Back to User Dashboard"
   │
   └─► Use All Regular User Features
```

---

## 🔒 Protected Routes Flow

### Before Login (Logged Out)
```
Navbar Shows:
├─ 🏠 Home
├─ 📢 Awareness
└─ 👤 Login

❌ "Find Recyclers" is HIDDEN
❌ "Dashboard" is HIDDEN

Attempting to access:
├─ /recycler-directory → 🔄 Redirect to /login
├─ /dashboard → 🔄 Redirect to /login
└─ /admin/dashboard → 🔄 Redirect to /login
```

### After Login (Regular User)
```
Navbar Shows:
├─ 🏠 Home
├─ 📢 Awareness
├─ 🔍 Find Recyclers ✅ NOW VISIBLE
├─ 📊 Dashboard
└─ Logout

Can Access:
├─ /recycler-directory ✅
├─ /dashboard ✅
└─ /add-panel ✅

Cannot Access:
└─ /admin/dashboard → 🔄 Redirect to /dashboard
```

### After Login (Admin User)
```
Navbar Shows:
├─ 🏠 Home
├─ 📢 Awareness
├─ 🔍 Find Recyclers ✅
├─ 📊 Dashboard
└─ Logout

Can Access:
├─ /recycler-directory ✅
├─ /dashboard ✅
├─ /add-panel ✅
└─ /admin/dashboard ✅ ADMIN ONLY

Login Redirect:
└─ Goes to /admin/dashboard (not /dashboard)
```

---

## 🔄 Registration Flow Comparison

### ❌ OLD Flow (Before Changes)
```
Register Form
   │
   ├─► Submit
   │
   ├─► Account Created
   │
   ├─► ❌ Auto-Login
   │
   └─► Redirect to Dashboard
```

### ✅ NEW Flow (After Changes)
```
Register Form
   │
   ├─► Submit
   │
   ├─► Account Created
   │
   ├─► 📧 Welcome Email
   │
   ├─► ✅ NO Auto-Login
   │
   ├─► Redirect to Login Page
   │
   ├─► Show Success Message
   │
   └─► User Must Login Manually
```

---

## 🔍 Find Recyclers Access

### ❌ OLD Behavior (Before Changes)
```
Navbar (Logged Out):
├─ Home
├─ Awareness
├─ Find Recyclers ❌ VISIBLE TO ALL
└─ Login

Anyone could access /recycler-directory
```

### ✅ NEW Behavior (After Changes)
```
Navbar (Logged Out):
├─ Home
├─ Awareness
└─ Login
    ❌ Find Recyclers HIDDEN

Navbar (Logged In):
├─ Home
├─ Awareness
├─ Find Recyclers ✅ NOW VISIBLE
├─ Dashboard
└─ Logout

/recycler-directory requires authentication
```

---

## 🗄️ Database Structure

### Users Collection
```
{
  _id: ObjectId("..."),
  username: "john_doe",
  email: "john@example.com",
  password: "$2a$10$...", // Hashed
  isAdmin: false,         // or true for admin
  created_at: ISODate("2024-01-15T10:30:00Z")
}
```

### Solar Panels Collection
```
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // Reference to User
  brand: "SunPower",
  model: "X-Series",
  capacity_watts: 5000,
  warranty_years: 25,
  installation_date: ISODate("2020-06-15T00:00:00Z"),
  location: "Mumbai",
  serial_number: "SP-2020-12345",
  created_at: ISODate("2024-01-15T10:35:00Z")
}
```

---

## 🎭 Role-Based Access

### Regular User Permissions
```
✅ Can Access:
├─ Home page
├─ Awareness page
├─ Login/Register
├─ User Dashboard (after login)
├─ Add/Delete own panels
├─ Recycler Directory (after login)
└─ Logout

❌ Cannot Access:
└─ Admin Dashboard
```

### Admin User Permissions
```
✅ Can Access:
├─ All Regular User features
├─ Admin Dashboard
├─ View all users
├─ View system statistics
└─ Switch between admin and user dashboards

❌ Cannot Do:
├─ Delete other users (not implemented)
└─ Modify other users' panels (not implemented)
```

---

## 🔐 Authentication Flow

### Session Management
```
Login Success
   │
   ├─► Create Session
   │   ├─ user.id
   │   ├─ user.username
   │   └─ user.isAdmin
   │
   ├─► Store in req.session
   │
   ├─► Set Cookie
   │
   └─► Valid for 24 hours

Logout
   │
   ├─► Destroy Session
   │
   ├─► Clear Cookie
   │
   └─► Redirect to Home
```

### Route Protection
```
Request to Protected Route
   │
   ├─► Check req.session.user
   │
   ├─► If exists:
   │   └─► Allow access ✅
   │
   └─► If not exists:
       └─► Redirect to /login ❌

Request to Admin Route
   │
   ├─► Check req.session.user
   │
   ├─► Check req.session.user.isAdmin
   │
   ├─► If both true:
   │   └─► Allow access ✅
   │
   └─► If either false:
       └─► Redirect to /dashboard ❌
```

---

## 📧 Email Flow

### Welcome Email
```
User Registers
   │
   ├─► Account Created in MongoDB
   │
   ├─► Trigger Email Service
   │
   ├─► Send Welcome Email
   │   ├─ To: user.email
   │   ├─ Subject: "Welcome to SolarLoop"
   │   └─ Body: Welcome message
   │
   ├─► Log Result
   │   ├─ Success: "Email sent to user@example.com"
   │   └─ Failure: "Email failed: [error]"
   │
   └─► Continue (don't block registration)
```

---

## 🚀 Deployment Flow

### Local to Production
```
Local Development
   │
   ├─► MongoDB: localhost:27017
   ├─► Test all features
   └─► Ready for deployment
       │
       ├─► Setup MongoDB Atlas
       │   ├─ Create cluster
       │   ├─ Create user
       │   ├─ Whitelist IPs
       │   └─ Get connection string
       │
       ├─► Push to GitHub
       │   ├─ git init
       │   ├─ git add .
       │   ├─ git commit
       │   └─ git push
       │
       ├─► Deploy on Render
       │   ├─ Connect GitHub
       │   ├─ Set environment variables
       │   ├─ Deploy
       │   └─ Get production URL
       │
       └─► Setup Admin User
           ├─ Register via website
           ├─ Use Render Shell
           └─ Run manage-admin.js
```

---

## 🎯 Quick Reference

### User Actions
| Action | Logged Out | Regular User | Admin User |
|--------|-----------|--------------|------------|
| View Home | ✅ | ✅ | ✅ |
| View Awareness | ✅ | ✅ | ✅ |
| Register | ✅ | ❌ | ❌ |
| Login | ✅ | ❌ | ❌ |
| View Dashboard | ❌ | ✅ | ✅ |
| Add Panel | ❌ | ✅ | ✅ |
| Find Recyclers | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ✅ |

### Route Protection
| Route | Public | Auth Required | Admin Required |
|-------|--------|---------------|----------------|
| / | ✅ | ❌ | ❌ |
| /awareness | ✅ | ❌ | ❌ |
| /login | ✅ | ❌ | ❌ |
| /register | ✅ | ❌ | ❌ |
| /dashboard | ❌ | ✅ | ❌ |
| /add-panel | ❌ | ✅ | ❌ |
| /recycler-directory | ❌ | ✅ | ❌ |
| /admin/dashboard | ❌ | ✅ | ✅ |

---

## 📝 Summary

### Key Changes Implemented:
1. ✅ MongoDB replaces JSON files
2. ✅ Admin system with role-based access
3. ✅ Protected "Find Recyclers" route
4. ✅ Registration redirects to login
5. ✅ Session-based authentication
6. ✅ Email notifications
7. ✅ Ready for Render deployment

### User Experience:
- Clear separation between admin and regular users
- Protected routes require authentication
- Smooth registration and login flow
- Intuitive navigation based on user role
