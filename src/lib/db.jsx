import PropTypes from 'prop-types';

export const getChats = async (supabase, userId) => {
  if (!userId) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};

export const getChatMessages = async (supabase, id) => {
  if (!id) return [];

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', id)
    .order('created_at');

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};

export const createChat = async (supabase, title, userId) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('chats')
    .insert({
      title,
      user_id: userId,
    })
    .select();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Could not create chat');
  }

  return data[0];
};

export const addMessage = async (
  supabase,
  chatId,
  message,
  attachments = []
) => {
  if (!chatId) return message;

  const { error } = await supabase.from('messages').insert({
    chat_id: chatId,
    role: message.role,
    text: message.content,
    attachments,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return message;
};

getChats.propTypes = {
  supabase: PropTypes.object.isRequired,
  userId: PropTypes.string,
};

getChatMessages.propTypes = {
  supabase: PropTypes.object.isRequired,
  id: PropTypes.string,
};

createChat.propTypes = {
  supabase: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  userId: PropTypes.string,
};

addMessage.propTypes = {
  supabase: PropTypes.object.isRequired,
  chatId: PropTypes.string,
  message: PropTypes.shape({
    role: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    metadata: PropTypes.object,
  }).isRequired,
  attachments: PropTypes.array,
};
