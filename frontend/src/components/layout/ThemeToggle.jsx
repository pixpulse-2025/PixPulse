import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all outline-none group"
      aria-label="Toggle Theme Mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon (Light Mode) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 w-5 h-5 transform transition-all duration-500 ${theme === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
            } text-gray-700 dark:text-gray-300`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 w-5 h-5 transform transition-all duration-500 ${theme === 'light'
              ? '-rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
            } text-gray-700 dark:text-gray-300`}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;
