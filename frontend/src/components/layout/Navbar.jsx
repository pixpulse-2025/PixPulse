import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { logout as logoutAction, selectUser, selectIsAuthenticated } from "../../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", path: "/explore" },
    { name: "Community", path: "/community" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-background/90 backdrop-blur-xl border-b border-[#3D52A0]/10 py-4"
        : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              PIX<span className="text-primary dark:text-accent">PULSE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-widest transition-all hover:text-[#7091E6] ${location.pathname === link.path
                  ? "text-primary dark:text-accent font-semibold border-b-2 border-primary dark:border-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            {user && (
              <div className="hidden md:flex items-center gap-6 text-text/40">
                <Link to="/favorites" className="hover:text-[#7091E6] transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </Link>
                <Link to="/cart" className="hover:text-[#7091E6] transition-all relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </Link>
              </div>
            )}

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-8">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5B8DEF] hover:bg-[#4F7CFF] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Upload
                </Link>
                <div className="relative group/user">
                  <button className="flex items-center gap-3 p-1 rounded-full transition-colors">
                    <div className="w-10 h-10 rounded-full border-2 border-[#7091E6]/30 overflow-hidden">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3d52a0&color=fff`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  <div className="absolute right-0 mt-4 w-60 bg-background/95 backdrop-blur-3xl border border-[#3D52A0]/10 rounded-2xl shadow-2xl py-4 invisible group-hover/user:visible scale-95 group-hover/user:scale-100 opacity-0 group-hover/user:opacity-100 transition-all duration-200 z-[60]">
                    <div className="px-6 py-3 mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#7091E6] mb-1">Artist Profile</p>
                      <p className="text-sm font-bold text-text truncate">{user.name}</p>
                    </div>
                    <div className="h-px bg-[#3D52A0]/5 my-2 mx-4"></div>
                    <Link to="/dashboard" className="block px-6 py-3 text-xs font-bold text-text/60 hover:text-[#7091E6] hover:bg-text/5 transition-all">Dashboard</Link>
                    <Link to="/profile" className="block px-6 py-3 text-xs font-bold text-text/60 hover:text-[#7091E6] hover:bg-text/5 transition-all">My Profile</Link>
                    <div className="h-px bg-[#3D52A0]/5 my-2 mx-4"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-text/60 hover:text-text transition-all">Login</Link>
                <Link to="/register" className="btn-primary text-xs px-5 py-2.5">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-text"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-[#3D52A0]/10 animate-fade-in shadow-2xl">
          <div className="flex flex-col p-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-text uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-[#3D52A0]/5 my-2"></div>

            {user ? (
              <>
                <Link to="/upload" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-primary uppercase tracking-widest">Upload</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-text uppercase tracking-widest">Profile</Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xl font-bold text-red-500 uppercase tracking-widest text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-text uppercase tracking-widest">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-primary uppercase tracking-widest">Sign Up</Link>
              </>
            )}
            <div className="h-px bg-[#3D52A0]/5 my-4"></div>
            <div className="flex justify-between items-center text-text/40 uppercase text-[10px] font-black tracking-widest">
              <span>Mode</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
