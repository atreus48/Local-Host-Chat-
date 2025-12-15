import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction, subtitle }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3 flex-1">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-slate-100 leading-tight">
            {title || 'CipherChat'}
          </h1>
          {subtitle && (
            <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
          )}
        </div>
      </div>
      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
};
