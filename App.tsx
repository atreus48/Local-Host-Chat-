import React, { useEffect, useState } from 'react';
import { AppRoute, UserIdentity } from './types';
import { getIdentity } from './services/storageService';
import { Onboarding } from './views/Onboarding';
import { Home } from './views/Home';
import { Chat } from './views/Chat';
import { Settings } from './views/Settings';
import { Pairing } from './views/Pairing';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.ONBOARDING);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedIdentity = getIdentity();
    if (storedIdentity) {
      setIdentity(storedIdentity);
      setCurrentRoute(AppRoute.HOME);
    } else {
      setCurrentRoute(AppRoute.ONBOARDING);
    }
  }, []);

  const handleIdentityCreated = (newIdentity: UserIdentity) => {
    setIdentity(newIdentity);
    setCurrentRoute(AppRoute.HOME);
  };

  const navigateToChat = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentRoute(AppRoute.CHAT);
  };

  const handleLogout = () => {
    setIdentity(null);
    setActiveChatId(null);
    setCurrentRoute(AppRoute.ONBOARDING);
  };

  // Simple Router
  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.ONBOARDING:
        return <Onboarding onComplete={handleIdentityCreated} />;
      
      case AppRoute.HOME:
        if (!identity) return null;
        return (
          <Home 
            identity={identity} 
            onNavigate={navigateToChat}
            onOpenSettings={() => setCurrentRoute(AppRoute.SETTINGS)}
            onOpenPairing={() => setCurrentRoute(AppRoute.PAIRING)}
          />
        );
      
      case AppRoute.CHAT:
        if (!identity || !activeChatId) return null;
        return (
          <Chat 
            chatId={activeChatId} 
            identity={identity} 
            onBack={() => {
              setActiveChatId(null);
              setCurrentRoute(AppRoute.HOME);
            }} 
          />
        );

      case AppRoute.SETTINGS:
        if (!identity) return null;
        return (
          <Settings 
            identity={identity} 
            onBack={() => setCurrentRoute(AppRoute.HOME)} 
            onLogout={handleLogout}
          />
        );

      case AppRoute.PAIRING:
        if (!identity) return null;
        return (
          <Pairing 
            identity={identity}
            onBack={() => setCurrentRoute(AppRoute.HOME)}
            onPairComplete={(newChatId) => {
              navigateToChat(newChatId);
            }}
          />
        );
        
      default:
        return <div className="p-10 text-white">404 Not Found</div>;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200">
      {renderContent()}
    </div>
  );
};

export default App;
