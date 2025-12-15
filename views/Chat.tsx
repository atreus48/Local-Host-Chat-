import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { Message, MessageStatus, ChatSession, UserIdentity } from '../types';
import { getMessages, saveMessage, saveSession, getSessions } from '../services/storageService';
import { generateUUID } from '../services/cryptoService';
import { format } from 'date-fns';

interface ChatProps {
  chatId: string;
  identity: UserIdentity;
  onBack: () => void;
}

export const Chat: React.FC<ChatProps> = ({ chatId, identity, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session and messages
  useEffect(() => {
    const sess = getSessions().find(s => s.id === chatId);
    if (sess) {
      setSession(sess);
      // Reset unread count
      if (sess.unreadCount > 0) {
        sess.unreadCount = 0;
        saveSession(sess);
      }
    }
    setMessages(getMessages(chatId));

    // Poll for new messages (Mocking real-time updates)
    const interval = setInterval(() => {
      const freshMessages = getMessages(chatId);
      // Simple deep check to update state only if needed
      if (JSON.stringify(freshMessages) !== JSON.stringify(messages)) {
        setMessages(freshMessages);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [chatId, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.status]);

  const updateMessageStatus = (msgId: string, status: MessageStatus) => {
    setMessages(prev => {
      const updatedMessages = prev.map(m => {
        if (m.id === msgId) {
          const updated = { ...m, status };
          saveMessage(updated); // Persist status change
          return updated;
        }
        return m;
      });
      return updatedMessages;
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !session) return;

    const messageId = generateUUID();
    const newMessage: Message = {
      id: messageId,
      chatId: chatId,
      senderId: identity.id,
      content: inputValue.trim(),
      timestamp: Date.now(),
      status: MessageStatus.PENDING,
      type: 'text',
      isMe: true,
    };

    saveMessage(newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Update session info
    const updatedSession = { 
      ...session, 
      lastMessage: newMessage.content,
      lastMessageTime: newMessage.timestamp
    };
    saveSession(updatedSession);
    setSession(updatedSession);

    // 1. Simulate Network Send (Pending -> Sent)
    setTimeout(() => {
      updateMessageStatus(messageId, MessageStatus.SENT);
    }, 600);

    // 2. Simulate Peer Ack (Sent -> Delivered)
    setTimeout(() => {
      updateMessageStatus(messageId, MessageStatus.DELIVERED);
    }, 1500);

    // 3. Simulate Peer Read & Reply (Delivered -> Read + Reply)
    setTimeout(() => {
      updateMessageStatus(messageId, MessageStatus.READ);
      
      const reply: Message = {
        id: generateUUID(),
        chatId: chatId,
        senderId: session.id,
        content: `Echo: ${newMessage.content}`,
        timestamp: Date.now(),
        status: MessageStatus.READ,
        type: 'text',
        isMe: false,
      };
      saveMessage(reply);
      // We rely on polling or local update to show reply
      setMessages(prev => [...prev, reply]);
      
      const newSess = { ...updatedSession, lastMessage: reply.content, lastMessageTime: reply.timestamp, isOnline: true };
      saveSession(newSess);
      setSession(newSess);
    }, 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.PENDING: 
        return <Icon name="Clock" size={12} className="text-blue-200/50" />;
      case MessageStatus.SENT: 
        return <Icon name="Check" size={12} className="text-blue-200/70" />;
      case MessageStatus.DELIVERED: 
        return <Icon name="CheckCheck" size={12} className="text-blue-200/70" />;
      case MessageStatus.READ: 
        return <Icon name="CheckCheck" size={12} className="text-white" />;
      case MessageStatus.FAILED: 
        return <Icon name="AlertCircle" size={12} className="text-red-300" />;
      default: 
        return null;
    }
  };

  if (!session) return <div className="p-10 text-center text-slate-500">Loading chat...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <Header 
        title={session.peerNickname}
        subtitle={session.isOnline ? 'Online via Relay' : 'Offline'}
        onBack={onBack}
        rightAction={
          <div className={`w-8 h-8 rounded-full ${session.peerAvatarColor} flex items-center justify-center text-xs font-bold`}>
            {session.peerNickname.charAt(0)}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
        <div className="text-center py-4">
          <span className="text-xs font-medium text-slate-600 bg-slate-800/50 px-3 py-1 rounded-full">
            Messages are end-to-end encrypted
          </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.isMe 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.content}
              <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.isMe ? 'text-blue-200' : 'text-slate-500'}`}>
                <span>{format(msg.timestamp, 'HH:mm')}</span>
                {msg.isMe && getStatusIcon(msg.status)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <div className="flex items-end gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Icon name="Plus" size={20} />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none py-2 max-h-32 focus:outline-none text-sm"
            rows={1}
            style={{ minHeight: '36px' }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 transition-colors"
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};