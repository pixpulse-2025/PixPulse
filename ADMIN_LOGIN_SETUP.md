# Admin Login & Dashboard Setup Guide

## 🔐 Issue: Admin Login Not Showing Admin Dashboard

### Problem
When an admin user logs in, they were being redirected to the regular user dashboard instead of the admin dashboard.

### ✅ Solution Applied

**1. Updated Login Component** (`Login.jsx`)
- Now checks if user has `role === 'admin'`
- Automatically redirects admins to `/admin` dashboard
- Regular users go to `/dashboard`

**2. Updated Dashboard Component** (`Dashboard.jsx`)
- Added redirect logic to send admins to admin dashboard
- Prevents admins from accessing regular dashboard

---

## 🚀 How to Create an Admin User

### Method 1: Direct Database Update (Recommended for Testing)

1. **Access MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - Login to your account
   - Navigate to your cluster

2. **Open Collections:**
   - Click "Browse Collections"
   - Select your database
   - Find the `users` collection

3. **Update User Role:**
   - Find the user you want to make admin
   - Click "Edit" on that document
   - Change `role` field from `"user"` to `"admin"`
   - Click "Update"

**Example:**
```json
{
  "_id": "...",
  "name": "Admin User",
  "email": "admin@pixpulse.com",
  "role": "admin",  // ← Change this from "user" to "admin"
  "isBlocked": false,
  ...
}
```

### Method 2: Using MongoDB Compass

1. **Install MongoDB Compass** (if not installed)
2. **Connect to your database** using connection string
3. **Navigate to users collection**
4. **Edit user document:**
   ```json
   {
     "role": "admin"
   }
   ```
5. **Save changes**

### Method 3: Backend Script (Future Enhancement)

Create a script to promote users to admin:

```javascript
// backend/scripts/makeAdmin.js
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`${user.name} is now an admin!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Usage: node scripts/makeAdmin.js admin@pixpulse.com
makeAdmin(process.argv[2]);
```

---

## 🧪 Testing Admin Login

### Step 1: Create Admin User
1. Register a new user or use existing user
2. Update their role to "admin" in database

### Step 2: Test Login Flow
1. **Logout** if currently logged in
2. **Navigate to** `/login`
3. **Enter admin credentials:**
   - Email: admin@pixpulse.com
   - Password: [your password]
4. **Click "Sign In"**

### Step 3: Verify Redirect
✅ Should automatically redirect to `/admin` dashboard  
✅ Should see admin dashboard with statistics  
✅ Should see admin navigation options

### Step 4: Test Admin Features
- [ ] View dashboard statistics
- [ ] Access user management (`/admin/users`)
- [ ] Access artwork management (`/admin/artworks`)
- [ ] Access analytics (`/admin/analytics`)
- [ ] Access reports (`/admin/reports`)

---

## 🎯 Expected Behavior

### For Admin Users:
```
Login → Redirect to /admin → Admin Dashboard
```

**Admin Dashboard Shows:**
- Total users, artworks, revenue, reports
- Recent activity feed
- Quick action buttons
- Navigation to:
  - User Management
  - Artwork Management
  - Analytics
  - Reports

### For Regular Users:
```
Login → Redirect to /dashboard → User Dashboard
```

**User Dashboard Shows:**
- Personal statistics
- Upload artworks
- My uploads
- Favorites
- Purchase history

### For Artists:
```
Login → Redirect to /dashboard → User Dashboard (with upload features)
```

**Artist Dashboard Shows:**
- Same as regular user
- Plus upload and manage artworks

---

## 🔍 Troubleshooting

### Issue: Still Redirecting to Wrong Dashboard

**Check 1: User Role in Database**
```javascript
// Verify in MongoDB
{
  "role": "admin"  // Must be exactly "admin", not "Admin" or "ADMIN"
}
```

**Check 2: Clear Browser Cache**
1. Open DevTools (F12)
2. Go to Application tab
3. Clear localStorage
4. Refresh page
5. Login again

**Check 3: Check JWT Token**
1. Open DevTools Console
2. Run: `localStorage.getItem('token')`
3. Decode JWT at https://jwt.io
4. Verify `role` field in payload

**Check 4: Backend Response**
1. Open Network tab in DevTools
2. Login
3. Check `/api/auth/login` response
4. Verify user object has correct role

### Issue: Admin Routes Not Accessible

**Check 1: ProtectedRoute Component**
- Verify it's wrapping admin routes
- Check authentication is working

**Check 2: Route Configuration**
```javascript
// In App.jsx
<Route path="/admin" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 📊 User Roles Explained

### User (role: "user")
- **Access:** Public pages, marketplace, cart, favorites
- **Features:** Browse, purchase, favorite artworks
- **Dashboard:** User dashboard (`/dashboard`)

### Artist (role: "artist")
- **Access:** All user features + upload
- **Features:** Upload artworks, manage uploads
- **Dashboard:** User dashboard with upload features

### Admin (role: "admin")
- **Access:** All features + admin panel
- **Features:** Manage users, artworks, reports, analytics
- **Dashboard:** Admin dashboard (`/admin`)

---

## 🎨 Admin Dashboard Features

### Main Dashboard (`/admin`)
- Platform statistics
- Recent activity
- Quick actions

### User Management (`/admin/users`)
- View all users
- Block/Unblock users
- Delete users
- Change user roles
- Search and filter

### Artwork Management (`/admin/artworks`)
- View all artworks
- Hide/Show artworks
- Delete artworks
- Preview artworks
- Search and filter

### Analytics (`/admin/analytics`)
- Top creators
- Top sales
- Revenue by category
- Platform metrics

### Reports Management (`/admin/reports`)
- View all reports
- Update report status
- Add admin notes
- Delete reports
- Filter by status

---

## ✅ Quick Test Checklist

- [ ] Create admin user in database
- [ ] Logout from current session
- [ ] Login with admin credentials
- [ ] Verify redirect to `/admin`
- [ ] Check admin dashboard loads
- [ ] Test user management page
- [ ] Test artwork management page
- [ ] Test analytics page
- [ ] Test reports page
- [ ] Verify regular users can't access admin routes

---

## 🚀 Summary

**Changes Made:**
1. ✅ Updated `Login.jsx` to redirect admins to `/admin`
2. ✅ Updated `Dashboard.jsx` to redirect admins from user dashboard
3. ✅ Admin users now automatically see admin dashboard

**To Test:**
1. Create admin user in database
2. Login with admin credentials
3. Should see admin dashboard immediately

**Admin Dashboard URL:** `http://localhost:5173/admin`

**Status:** ✅ FIXED - Admins now redirect to admin dashboard on login!
