import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatSessions } from '../redux/reducers/chat.reducer';

const ChatSessions = () => {
  const dispatch = useDispatch();
  const { chatSessions, isLoading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChatSessions());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Chat Sessions</h1>
      <ul>
        {chatSessions.map((session) => (
          <li key={session.id}>{session.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSessions;
