import { motion } from 'framer-motion';

/**
 * Renders a feature card component with animation effects
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.icon - The icon to display in the card
 * @param {string} props.title - The title of the feature
 * @param {string} props.description - The description of the feature
 * @returns {React.ReactElement} A motion div containing the feature card content
 */
export const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
    className="bg-white bg-opacity-10 p-6 rounded-lg"
  >
    {icon}
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </motion.div>
);

export default FeatureCard;
