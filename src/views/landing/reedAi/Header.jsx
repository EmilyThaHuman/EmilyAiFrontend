import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/themed/RadixUi/button';

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-sm"
    >
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <MessageSquare className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">ReedAi</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:text-black hover:bg-white"
          >
            About
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-black hover:bg-white"
          >
            Demo
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-black hover:bg-white"
          >
            Contact
          </Button>
          <Button
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black"
          >
            <span className="mr-2">28.5k</span>
            <MessageSquare className="h-4 w-4" />
          </Button>
          {isLoggedIn ? (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-white hover:text-black hover:bg-white"
              >
                Login
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
