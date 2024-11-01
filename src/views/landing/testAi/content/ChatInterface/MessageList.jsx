/**
 * Renders a list of messages in a chat-like interface.
 * @param {Object} props - The component props.
 * @param {Array} props.messages - An array of message objects to display.
 * @returns {JSX.Element} A div containing the rendered message list.
 */
const MessageList = ({ messages }) => (
  <div className="message-list p-4 overflow-y-auto h-64 bg-gray-100">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`message mb-2 ${
          msg.sender === 'user' ? 'text-right' : 'text-left'
        }`}
      >
        <div
          className={`inline-block px-3 py-2 rounded ${
            msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'
          }`}
        >
          {msg.text}
        </div>
      </div>
    ))}
  </div>
);

export default MessageList;
