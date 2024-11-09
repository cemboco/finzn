import React from 'react';
import { WalletCards, LayoutDashboard, UserCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationCenter } from './NotificationCenter';
import { Profile, Transaction } from '../types/finance';

interface HeaderProps {
  onViewChange: (view: 'dashboard' | 'profile') => void;
  currentView: 'dashboard' | 'profile';
  theme: string;
  onThemeToggle: () => void;
  profile: Profile;
  transactions: Transaction[];
}

export function Header({ onViewChange, currentView, theme, onThemeToggle, profile, transactions }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 text-gray-800 dark:text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <WalletCards className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold">FinanzGarten</h1>
        </motion.div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4">
            <NavButton
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              isActive={currentView === 'dashboard'}
              onClick={() => onViewChange('dashboard')}
            />
            <NavButton
              icon={<UserCircle className="h-5 w-5" />}
              label="Profil"
              isActive={currentView === 'profile'}
              onClick={() => onViewChange('profile')}
            />
          </nav>
          <NotificationCenter profile={profile} transactions={transactions} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'hover:bg-indigo-50 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}