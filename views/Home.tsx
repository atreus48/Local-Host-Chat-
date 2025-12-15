import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { ChatSession, UserIdentity } from '../types';
import { getSessions } from '../services/storageService';
import { format } from 'date-fns';

interface HomeProps {
  identity: UserIdentity;
  onNavigate: (chatId: string) => void;
  onOpenSettings: () => void;
  onOpenPairing: () => void;
}

export const Home: React.FC<HomeProps> = ({ identity, onNavigate, onOpenSettings, onOpenPairing }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    // Load sessions from storage
    const loadSessions = () => {
      const stored = getSessions();
      // Sort by last message time
      setSessions(stored.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)));
    };
    loadSessions();
    
    // In a real app, we'd subscribe to storage updates
    const interval = setInterval(loadSessions, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header 
        title="Chats" 
        rightAction={
          <button onClick={onOpenSettings} className="p-2 text-slate-400 hover:text-white transition-colors">
            <Icon name="Settings" size={20} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-20">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 p-6 text-center space-y-4">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-2">
              <Icon name="MessageSquarePlus" size={40} className="opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-slate-300">No chats yet</h3>
            <p className="max-w-xs text-sm">Tap the button below to pair with a device nearby or over the internet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onNavigate(session.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors active:bg-slate-800"
              >
                <div className={`w-12 h-12 rounded-full ${session.peerAvatarColor} flex items-center justify-center text-white font-bold text-lg shadow-lg relative`}>
                  {session.peerNickname.charAt(0).toUpperCase()}
                  {session.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-slate-200 truncate pr-2">{session.peerNickname}</h3>
                    {session.lastMessageTime && (
                      <span className="text-xs text-slate-500 shrink-0">
                        {format(session.lastMessageTime, 'HH:mm')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400 truncate pr-4">
                      {session.lastMessage || <span className="italic text-slate-600">No messages yet</span>}
                    </p>
                    {session.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6">
        <button 
          onClick={onOpenPairing}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <Icon name="QrCode" size={24} />
        </button>
      </div>
    </div>
  );
};
