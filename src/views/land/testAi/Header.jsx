import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/themed/RadixUi/button';
import routes from '@/routes/index';
import { analyzeRoutes } from 'utils/routing';

export const Header = () => {
  const navigate = useNavigate();
  const routeData = analyzeRoutes(routes);
  const handleBack = () => {
    navigate(-1);
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
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
