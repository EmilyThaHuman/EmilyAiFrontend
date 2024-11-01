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
