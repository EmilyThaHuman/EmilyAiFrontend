// components/ChatList.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChats = async () => {
      try {
        // const chatSessions = await fetchAllChatSessions();
        const chatSessions = [
          { id: 1, title: 'Chat Session 1' },
          { id: 2, title: 'Chat Session 2' },
          { id: 3, title: 'Chat Session 3' },
        ];
        setChats(chatSessions);
      } catch (err) {
        setError(err.message);
      }
    };

    loadChats();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Your Chat Sessions</h2>
      <ul>
        {chats.map(chat => (
          <li key={chat.id}>
            <Link to={`/admin/workspaces/home/chat/${chat.id}`}>
              {chat.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/admin/workspaces/home/chat/new">Start a New Chat</Link>
    </div>
  );
};

export default ChatList;
