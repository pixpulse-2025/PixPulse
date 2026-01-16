import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { logout as logoutAction, selectUser, selectIsAuthenticated } from "../../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Explore", path: "/explore" },
    { name: "Community", path: "/community" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "glass shadow-sm py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
            P
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            PixPulse
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${location.pathname === link.path
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-300"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/upload"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-all border border-gray-200 dark:border-gray-800 rounded-full hover:border-primary-500"
                >
                  <span className="text-lg">+</span> Upload
                </Link>
                <div className="relative group">
                  <button
                    className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    id="user-menu-button"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-primary-500 overflow-hidden shadow-sm">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 pr-1">
                      {user.name.split(' ')[0]}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-[60]">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </Link>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-all hover:shadow-lg hover:shadow-primary-500/20 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-b border-gray-200 dark:border-gray-800 animate-slide-up">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-800 dark:text-gray-100"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Appearance</span>
              <ThemeToggle />
            </div>
            {user ? (
              <>
                <div className="text-sm text-gray-500">Signed in as {user.name}</div>
                <button onClick={handleLogout} className="w-full py-2 text-center text-white bg-red-500 rounded-lg">Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-2 text-center text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-2 text-center text-white bg-primary-600 rounded-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
