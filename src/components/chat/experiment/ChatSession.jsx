// components/ChatSession.jsx

import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

const ChatSession = () => {
  const { sessionId } = useParams();

  return (
    <div>
      <h1>Chat Session ID: {sessionId}</h1>
      {/* Render the ChatMain component */}
      <Outlet />
    </div>
  );
};

export default ChatSession;
