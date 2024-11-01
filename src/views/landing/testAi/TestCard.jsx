import { motion } from 'framer-motion';

export const TestCard = ({ icon, title, description, state }) => (
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
    {state && (
      <button
        onClick={state.onOpen}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Test
      </button>
    )}
  </motion.div>
);

export default TestCard;
