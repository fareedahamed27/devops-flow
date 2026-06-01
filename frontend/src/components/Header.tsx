import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, LogOut, Home, Menu, X, FileText, Users, Moon, Sun, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Questionnaire', icon: FileText, path: '/questionnaire' },
    { label: 'Connect Partner', icon: Users, path: '/pair' },
    { label: 'Profile', icon: Settings, path: '/profile' },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-1.5 lg:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Heart className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              RelationSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Button 
                    key={item.path}
                    variant="ghost" 
                    size="sm" 
                    icon={item.icon} 
                    onClick={() => navigate(item.path)}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {item.label}
                  </Button>
                ))}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-600">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleTheme}
                    icon={isDark ? Sun : Moon}
                    className="text-sm"
                  />
                  <Button variant="ghost" size="sm" icon={User} className="text-sm text-gray-700 dark:text-gray-300">
                    {user.name}
                  </Button>
                  <Button variant="outline" size="sm" icon={LogOut} onClick={handleLogout} className="text-sm">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleTheme}
                  icon={isDark ? Sun : Moon}
                  className="text-sm"
                />
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-sm">
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')} className="text-sm">
                  Get Started
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              icon={isDark ? Sun : Moon}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              icon={isMenuOpen ? X : Menu}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-4"
            >
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 mb-2">
                    {user.name}
                  </div>
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-left"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};