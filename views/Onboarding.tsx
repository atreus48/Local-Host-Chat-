import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { generateIdentityKeys, generateUUID } from '../services/cryptoService';
import { saveIdentity } from '../services/storageService';
import { UserIdentity } from '../types';
import { THEME_COLORS } from '../constants';

interface OnboardingProps {
  onComplete: (identity: UserIdentity) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [nickname, setNickname] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateIdentity = async () => {
    if (!nickname.trim()) return;
    
    setIsGenerating(true);
    try {
      const keys = await generateIdentityKeys();
      const identity: UserIdentity = {
        id: generateUUID(),
        nickname: nickname.trim(),
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
        avatarColor: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
      };
      saveIdentity(identity);
      onComplete(identity);
    } catch (error) {
      console.error("Failed to generate identity", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="w-full max-w-sm space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-900/50 mb-6">
            <Icon name="Shield" size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">CipherChat</h1>
          <p className="text-slate-400">Secure, offline-capable, peer-to-peer messaging.</p>
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-4">
              <div className="flex items-start gap-3">
                <Icon name="WifiOff" className="text-emerald-400 shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-slate-200">Local & Offline</h3>
                  <p className="text-sm text-slate-400 mt-1">Works over LAN without internet. Connects directly to nearby devices.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Lock" className="text-amber-400 shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-slate-200">End-to-End Encrypted</h3>
                  <p className="text-sm text-slate-400 mt-1">No servers read your messages. Keys stay on your device.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="UserX" className="text-rose-400 shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-slate-200">No Sign Up</h3>
                  <p className="text-sm text-slate-400 mt-1">No email, phone number, or account required.</p>
                </div>
              </div>
            </div>
            <Button fullWidth onClick={() => setStep(2)}>
              Get Started
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label htmlFor="nickname" className="block text-sm font-medium text-slate-300">
                Choose a display name
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. GhostRider"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
              <p className="text-xs text-slate-500">This is visible to people you pair with.</p>
            </div>
            
            <Button 
              fullWidth 
              onClick={handleCreateIdentity} 
              disabled={!nickname.trim() || isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Icon name="Loader2" className="animate-spin" size={18} />
                  Generating Keys...
                </span>
              ) : (
                'Create Identity'
              )}
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setStep(1)} disabled={isGenerating}>
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
