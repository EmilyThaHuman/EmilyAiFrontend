/**
 * ChatHeader component that displays a header for a chat interface
 * @param {Object} props - The component props
 * @param {Function} props.onSettingsClick - Callback function to handle settings button click
 * @returns {JSX.Element} A header component with a title and settings button
 */
const ChatHeader = ({ onSettingsClick }) => (
  <div className="chat-header flex justify-between items-center p-4 bg-gray-800 text-white">
    <h2 className="text-lg font-bold">Chat Interface Test</h2>
    <button onClick={onSettingsClick} className="text-sm underline">
      Settings
    </button>
  </div>
);

export default ChatHeader;
