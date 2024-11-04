'use client';

import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SupabaseChatContext = createContext(null);

export const SupabaseChatProvider = ({ children }) => {
  const [supabase] = useState(() =>
    createClient(SUPABASE_URL, SUPABASE_API_KEY)
  );
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();

    const messageSubscription = supabase
      .from('messages')
      .on('INSERT', payload => {
        setMessages(prevMessages => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(messageSubscription);
    };
  }, [supabase]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  const sendMessage = async content => {
    const { error } = await supabase.from('messages').insert([{ content }]);
    if (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <SupabaseChatContext.Provider value={{ supabase, messages, sendMessage }}>
      {children}
    </SupabaseChatContext.Provider>
  );
};

export const useSupabaseChatStore = () => {
  const context = useContext(SupabaseChatContext);
  if (context === undefined) {
    throw new Error(
      'upabaseChatStore must be used inside SupabaseChatProvider'
    );
  }
  return context;
};

export const getSupabaseClient = () =>
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default SupabaseChatProvider;
