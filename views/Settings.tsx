import React from 'react';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { UserIdentity } from '../types';
import { clearIdentity } from '../services/storageService';

interface SettingsProps {
  identity: UserIdentity;
  onBack: () => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ identity, onBack, onLogout }) => {
  const handleWipe = () => {
    if (confirm('Are you sure? This will delete your identity and ALL messages permanently. This cannot be undone.')) {
      clearIdentity();
      onLogout();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header title="Settings" onBack={onBack} />
      
      <div className="p-6 space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <div className={`w-24 h-24 rounded-full ${identity.avatarColor} flex items-center justify-center text-3xl font-bold text-white shadow-xl`}>
            {identity.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{identity.nickname}</h2>
            <p className="text-xs text-slate-500 font-mono mt-1">{identity.id}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Privacy & Security</h3>
          <div className="bg-slate-800 rounded-xl overflow-hidden divide-y divide-slate-700/50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Wifi" className="text-emerald-500" size={20} />
                <span className="text-slate-200 text-sm">LAN Discovery</span>
              </div>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Globe" className="text-blue-500" size={20} />
                <span className="text-slate-200 text-sm">Public Relay</span>
              </div>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Key" className="text-amber-500" size={20} />
                <span className="text-slate-200 text-sm">Export Keys</span>
              </div>
              <Icon name="ChevronRight" className="text-slate-600" size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Danger Zone</h3>
          <button 
            onClick={handleWipe}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 p-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
          >
            <Icon name="Trash2" size={18} />
            Wipe Identity & Data
          </button>
          <p className="text-xs text-slate-600 text-center px-4">
            Deleting your identity will make existing chats unreadable on other devices.
          </p>
        </div>
      </div>

      <div className="mt-auto p-6 text-center">
        <p className="text-xs text-slate-600">CipherChat v1.0.0</p>
      </div>
    </div>
  );
};
