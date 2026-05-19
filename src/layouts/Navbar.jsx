import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiUser, FiBookOpen, FiList } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/rooms', label: 'Rooms' },
        { to: '/add-room', label: 'Add Room' },
        { to: '/my-listings', label: 'My Listings' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/rooms', label: 'Rooms' },
      ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FiBookOpen className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">StudyNook</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1">
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiList /> My Bookings
                    </Link>
                    <Link
                      to="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUser /> My Listings
                    </Link>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 px-4 pb-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          <button
            onClick={toggle}
            className="flex items-center gap-2 py-2 text-gray-700 dark:text-gray-300"
          >
            {dark ? <FiSun /> : <FiMoon />} {dark ? 'Light' : 'Dark'} Mode
          </button>
          {user ? (
            <>
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">
                My Bookings
              </Link>
              <button onClick={handleLogout} className="block py-2 text-red-600">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 mt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
