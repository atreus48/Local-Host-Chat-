import { ChatSession, Message, UserIdentity } from '../types';

const KEYS = {
  IDENTITY: 'cipherchat_identity',
  SESSIONS: 'cipherchat_sessions',
  MESSAGES: 'cipherchat_messages_', // prefix
};

export const saveIdentity = (identity: UserIdentity) => {
  localStorage.setItem(KEYS.IDENTITY, JSON.stringify(identity));
};

export const getIdentity = (): UserIdentity | null => {
  const data = localStorage.getItem(KEYS.IDENTITY);
  return data ? JSON.parse(data) : null;
};

export const clearIdentity = () => {
  localStorage.removeItem(KEYS.IDENTITY);
  // Also clear all sessions and messages for security
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('cipherchat_')) {
      localStorage.removeItem(key);
    }
  });
};

export const getSessions = (): ChatSession[] => {
  const data = localStorage.getItem(KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveSession = (session: ChatSession) => {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
};

export const getMessages = (chatId: string): Message[] => {
  const data = localStorage.getItem(KEYS.MESSAGES + chatId);
  return data ? JSON.parse(data) : [];
};

export const saveMessage = (message: Message) => {
  const messages = getMessages(message.chatId);
  // Check for duplicates
  if (!messages.find(m => m.id === message.id)) {
    messages.push(message);
    localStorage.setItem(KEYS.MESSAGES + message.chatId, JSON.stringify(messages));
  }
};
