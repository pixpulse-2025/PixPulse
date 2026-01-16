# Redux Auth - Quick Reference

## 🚀 Quick Start

### 1. Login User
```javascript
import { useAuth } from "../hooks/useAuth";

function LoginButton() {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login({
      email: "user@example.com",
      password: "password123"
    });
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </button>
  );
}
```

### 2. Register User
```javascript
const { register } = useAuth();

await register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});
```

### 3. Logout User
```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
};
```

### 4. Check Authentication Status
```javascript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log("User is logged in:", user.name);
} else {
  console.log("User is not logged in");
}
```

### 5. Load User on App Start
```javascript
// In App.jsx
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { loadUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      loadUser();
    }
  }, [loadUser, isAuthenticated]);

  return <div>{/* Your app */}</div>;
}
```

### 6. Update User Profile
```javascript
const { updateProfile } = useAuth();

await updateProfile({
  name: "Jane Doe",
  bio: "Digital artist"
});
```

### 7. Handle Errors
```javascript
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    alert(error);
    clearError();
  }
}, [error, clearError]);
```

### 8. Show Loading State
```javascript
const { loading } = useAuth();

if (loading) {
  return <div>Loading...</div>;
}
```

## 🛡️ Protected Routes

### Basic Protected Route
```javascript
import ProtectedRoute from "./components/ProtectedRoute";

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Multiple Protected Routes
```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  
  {/* Protected routes */}
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
</Routes>
```

## 🎨 UI Patterns

### Conditional Navbar
```javascript
const { isAuthenticated, user, logout } = useAuth();

<nav>
  {isAuthenticated ? (
    <>
      <span>Hi, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Sign Up</Link>
    </>
  )}
</nav>
```

### User Avatar with Dropdown
```javascript
const { user, logout } = useAuth();

<div className="user-menu">
  <img src={user.avatar} alt={user.name} />
  <div className="dropdown">
    <Link to="/profile">Profile</Link>
    <Link to="/settings">Settings</Link>
    <button onClick={logout}>Logout</button>
  </div>
</div>
```

### Login Form with Validation
```javascript
const [formData, setFormData] = useState({ email: "", password: "" });
const { login, loading, error } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  await login(formData);
};

<form onSubmit={handleSubmit}>
  {error && <div className="error">{error}</div>}
  <input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    required
  />
  <input
    type="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    required
  />
  <button type="submit" disabled={loading}>
    {loading ? "Logging in..." : "Login"}
  </button>
</form>
```

## 📊 Redux Selectors

### Using Selectors Directly
```javascript
import { useSelector } from "react-redux";
import { 
  selectUser, 
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError 
} from "../redux/slices/authSlice";

function MyComponent() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Use the values...
}
```

## 🔄 Cart & Artwork Examples

### Add to Cart
```javascript
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

const dispatch = useDispatch();

dispatch(addToCart({
  id: "123",
  title: "Sunset Painting",
  price: 99.99,
  image: "/images/sunset.jpg",
  artist: "Jane Doe"
}));
```

### Fetch Artworks
```javascript
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks, selectArtworks } from "../redux/slices/artworkSlice";

const dispatch = useDispatch();
const artworks = useSelector(selectArtworks);

useEffect(() => {
  dispatch(fetchArtworks({ page: 1, limit: 12 }));
}, [dispatch]);
```

## 🔧 Common Issues

### Issue: User not persisting after refresh
**Solution:** Make sure to call `loadUser()` in App.jsx useEffect

### Issue: Protected route not redirecting
**Solution:** Ensure `isAuthenticated` is properly set and ProtectedRoute is wrapping the component

### Issue: Token not being sent with requests
**Solution:** Check that axios default headers are set in authSlice after login

---

**Need more help?** Check `REDUX_AUTH_GUIDE.md` for detailed documentation.
