# Redux Authentication Setup - PixPulse

## 📋 Overview

This project uses **Redux Toolkit** for state management with a comprehensive authentication system. The auth state is persisted in localStorage and automatically rehydrated on app load.

## 🏗️ Architecture

### Redux Store Structure

```
src/
├── redux/
│   ├── store.js              # Redux store configuration
│   └── slices/
│       ├── authSlice.js      # Authentication state & actions
│       ├── artworkSlice.js   # Artwork management
│       └── cartSlice.js      # Shopping cart
├── hooks/
│   └── useAuth.js            # Custom auth hook
├── components/
│   └── ProtectedRoute.jsx    # Route guard component
└── pages/
    ├── Login.jsx             # Login page
    └── Register.jsx          # Registration page
```

## 🔐 Auth State

### State Shape

```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    // ... other user fields
  } | null,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null,
  registerSuccess: boolean
}
```

### Available Actions

#### Async Thunks (API Calls)
- `login(credentials)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `loadUser()` - Load user from token
- `updateProfile(userData)` - Update user profile

#### Sync Actions
- `clearError()` - Clear error messages
- `clearRegisterSuccess()` - Clear registration success flag
- `setCredentials({ user, token })` - Manually set auth credentials

## 🎯 Usage Examples

### 1. Using the Custom Hook

The easiest way to interact with auth state:

```javascript
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error,
    login, 
    logout,
    register 
  } = useAuth();

  const handleLogin = async () => {
    await login({ email: "user@example.com", password: "password123" });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Using Redux Directly

For more control, use Redux hooks:

```javascript
import { useSelector, useDispatch } from "react-redux";
import { 
  login, 
  selectUser, 
  selectIsAuthenticated 
} from "../redux/slices/authSlice";

function MyComponent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogin = async () => {
    const result = await dispatch(login({ 
      email: "user@example.com", 
      password: "password123" 
    }));
    
    if (login.fulfilled.match(result)) {
      console.log("Login successful!");
    }
  };

  return <div>{/* Your component */}</div>;
}
```

### 3. Protected Routes

Wrap routes that require authentication:

```javascript
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### 4. Conditional Rendering in Navbar

```javascript
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### API Endpoints Expected

The auth slice expects these backend endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update user profile (requires token)

### Request/Response Format

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

## 🛡️ Security Features

1. **Token Persistence**: JWT token stored in localStorage
2. **Auto-rehydration**: User state restored on page reload
3. **Axios Interceptors**: Token automatically added to requests
4. **Token Cleanup**: Token removed on logout or invalid auth
5. **Protected Routes**: Automatic redirect to login for unauthenticated users

## 📦 Additional Slices

### Artwork Slice

Manages artwork listings and details:

```javascript
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks, selectArtworks } from "../redux/slices/artworkSlice";

function ArtworkGallery() {
  const dispatch = useDispatch();
  const artworks = useSelector(selectArtworks);

  useEffect(() => {
    dispatch(fetchArtworks({ page: 1, limit: 12 }));
  }, [dispatch]);

  return <div>{/* Render artworks */}</div>;
}
```

### Cart Slice

Manages shopping cart with localStorage persistence:

```javascript
import { useDispatch, useSelector } from "react-redux";
import { 
  addToCart, 
  removeFromCart, 
  selectCartItems,
  selectCartTotal 
} from "../redux/slices/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      artist: product.artist
    }));
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

## 🚀 Best Practices

1. **Always use the custom hook** (`useAuth`) for auth operations
2. **Clear errors** when unmounting components
3. **Handle loading states** to improve UX
4. **Use ProtectedRoute** for authenticated-only pages
5. **Check `isAuthenticated`** before showing user-specific UI
6. **Dispatch `loadUser()`** on app mount to restore session

## 🐛 Troubleshooting

### User not persisting after refresh
- Check if token exists in localStorage
- Ensure `loadUser()` is called in App.jsx useEffect
- Verify backend `/auth/me` endpoint is working

### "useAuth must be used within an AuthProvider" error
- This error shouldn't occur with Redux setup
- Ensure Redux Provider wraps your app in main.jsx

### Login successful but user is null
- Check API response format matches expected structure
- Verify token is being saved to localStorage
- Check browser console for errors

## 📚 Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

---

**Created for PixPulse v2.0** - Premium digital art marketplace
