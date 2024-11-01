/**
 * Renders a chat input component with a text input field and a send button.
 * @param {string} value - The current value of the input field.
 * @param {function} onChange - Callback function triggered when the input value changes.
 * @param {function} onSend - Callback function triggered when the send button is clicked.
 * @returns {JSX.Element} A chat input component with an input field and a send button.
 */
const ChatInput = ({ value, onChange, onSend }) => (
  <div className="chat-input flex p-4 bg-white border-t border-gray-200">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="flex-grow border rounded px-3 py-2 mr-2"
      placeholder="Type a message..."
    />
    <button
      onClick={onSend}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Send
    </button>
  </div>
);

export default ChatInput;
