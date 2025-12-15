import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { UserIdentity, ChatSession } from '../types';
import { THEME_COLORS } from '../constants';
import { saveSession, getSessions } from '../services/storageService';
import { QRCodeSVG } from 'qrcode.react';

interface PairingProps {
  identity: UserIdentity;
  onBack: () => void;
  onPairComplete: (sessionId: string) => void;
}

export const Pairing: React.FC<PairingProps> = ({ identity, onBack, onPairComplete }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'show'>('show');
  const [manualId, setManualId] = useState('');

  // The connection string wraps the ID and nickname in a simple JSON-like structure
  // In production, this would be a full invite link or encoded public key
  const connectionString = JSON.stringify({
    id: identity.id,
    name: identity.nickname,
    key: identity.publicKey
  });

  const handleManualPair = () => {
    // Simulate finding a peer
    const mockPeerId = manualId || `peer_${Math.random().toString(36).substr(2, 5)}`;
    
    // Check if exists
    const existing = getSessions().find(s => s.id === mockPeerId);
    if (existing) {
      onPairComplete(existing.id);
      return;
    }

    const newSession: ChatSession = {
      id: mockPeerId,
      peerNickname: manualId ? `User ${manualId.substr(0,4)}` : 'Ghost Protocol',
      peerAvatarColor: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
      unreadCount: 0,
      isOnline: true, // assume found
      lastMessageTime: Date.now()
    };
    
    saveSession(newSession);
    setTimeout(() => onPairComplete(newSession.id), 500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <Header title="Pair Device" onBack={onBack} />

      <div className="p-2 grid grid-cols-2 gap-2 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('show')}
          className={`py-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'show' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          My Code
        </button>
        <button
          onClick={() => setActiveTab('scan')}
          className={`py-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'scan' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Scan / Enter ID
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {activeTab === 'show' ? (
          <div className="space-y-6 animate-fade-in w-full max-w-sm">
            <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl shadow-blue-900/20">
              <QRCodeSVG 
                value={connectionString} 
                size={200}
                level="M"
                includeMargin
                imageSettings={{
                    src: "",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{identity.nickname}</h3>
              <p className="text-slate-400 text-sm font-mono bg-slate-800 py-2 px-4 rounded-lg break-all select-all">
                {identity.id}
              </p>
            </div>
            <p className="text-sm text-slate-500">
              Ask your friend to scan this code or enter your ID to start a secure chat.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in w-full max-w-sm">
            <div className="aspect-square bg-slate-800 rounded-3xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center backdrop-blur-sm transition-all">
                <p className="text-white font-medium">Camera Simulated</p>
              </div>
              <Icon name="ScanLine" size={48} className="text-slate-600" />
              <p className="text-slate-500 text-sm">Camera scanning would appear here</p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">Or enter manually</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Peer UUID"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono text-sm"
              />
              <Button fullWidth onClick={handleManualPair}>
                Connect
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
