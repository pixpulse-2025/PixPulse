# PixPulse Authentication API Documentation

## 🚀 Base URL
```
http://localhost:5000/api
```

## 📋 Authentication Endpoints

### 1. Register User
Create a new user account.

**Endpoint:** `POST /auth/register`  
**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://ui-avatars.com/api/?name=User&background=random"
  }
}
```

**Error Responses:**
- `400` - Missing fields or user already exists
- `500` - Server error

---

### 2. Login User
Authenticate an existing user.

**Endpoint:** `POST /auth/login`  
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://ui-avatars.com/api/?name=User&background=random",
    "bio": "Digital artist and creator"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### 3. Get Current User
Get the authenticated user's profile.

**Endpoint:** `GET /auth/me`  
**Access:** Private (requires token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://ui-avatars.com/api/?name=User&background=random",
    "bio": "Digital artist and creator",
    "isVerified": false,
    "createdAt": "2026-01-14T09:15:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Not authorized, no token or invalid token
- `404` - User not found
- `500` - Server error

---

### 4. Update Profile
Update the authenticated user's profile.

**Endpoint:** `PUT /auth/profile`  
**Access:** Private (requires token)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "bio": "Professional digital artist",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Professional digital artist"
  }
}
```

**Error Responses:**
- `401` - Not authorized
- `404` - User not found
- `500` - Server error

---

### 5. Logout
Logout the current user (client-side token removal).

**Endpoint:** `POST /auth/logout`  
**Access:** Private (requires token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔐 Authentication Flow

### Registration Flow:
1. User submits registration form
2. Backend validates input
3. Backend checks if email already exists
4. Password is hashed using bcrypt
5. User is created in database
6. JWT token is generated
7. Token and user data returned to client
8. Client stores token in localStorage
9. Client sets axios default header

### Login Flow:
1. User submits login credentials
2. Backend finds user by email
3. Backend compares password hash
4. JWT token is generated
5. Token and user data returned to client
6. Client stores token in localStorage
7. Client sets axios default header

### Protected Route Access:
1. Client sends request with Authorization header
2. Backend middleware extracts token
3. Token is verified using JWT
4. User is fetched from database
5. User object is attached to request
6. Controller processes request

---

## 📝 User Model Schema

```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'artist', 'admin'], default: 'user'),
  avatar: String (default: generated avatar),
  bio: String (max 500 chars),
  isVerified: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🧪 Testing with Postman/Thunder Client

### Test Register:
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

### Test Login:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

### Test Get Me:
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### Test Update Profile:
```bash
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "New bio"
}
```

---

## 🔒 Security Features

✅ **Password Hashing** - bcrypt with salt rounds  
✅ **JWT Tokens** - 30-day expiration  
✅ **Email Validation** - Regex pattern matching  
✅ **Password Minimum Length** - 6 characters  
✅ **Protected Routes** - JWT verification middleware  
✅ **Role-Based Access** - Admin and artist middleware  
✅ **CORS Configuration** - Allowed origins only  
✅ **Input Validation** - Required field checks  

---

## 🌐 Frontend Integration

### Update Frontend .env:
```env
VITE_API_URL=http://localhost:5000/api
```

### Redux authSlice API calls will now work:
- `POST /api/auth/register` ✅
- `POST /api/auth/login` ✅
- `GET /api/auth/me` ✅
- `PUT /api/auth/profile` ✅

---

## 🚨 Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth error)
- `403` - Forbidden (permission error)
- `404` - Not Found
- `500` - Server Error

---

## 📦 Environment Variables

Required in `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

**Status:** ✅ Authentication API Complete and Running  
**Server:** http://localhost:5000  
**Database:** MongoDB Atlas Connected  
**Version:** 1.0.0
