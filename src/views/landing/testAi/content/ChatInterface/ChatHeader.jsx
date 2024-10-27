const ChatHeader = ({ onSettingsClick }) => (
  <div className="chat-header flex justify-between items-center p-4 bg-gray-800 text-white">
    <h2 className="text-lg font-bold">Chat Interface Test</h2>
    <button onClick={onSettingsClick} className="text-sm underline">
      Settings
    </button>
  </div>
);

export default ChatHeader;
