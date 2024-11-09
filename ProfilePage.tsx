import React from 'react';
import { LineChart, PieChart, Target, TrendingUp, Wallet, Edit2 } from 'lucide-react';
import { Profile, Transaction } from '../types/finance';
import { SavingsGoals } from './SavingsGoals';
import { CategoryManager } from './CategoryManager';
import { TransactionFilters } from './TransactionFilters';
import { SpendingChart } from './SpendingChart';
import { FinancialCalendar } from './FinancialCalendar';

interface ProfilePageProps {
  profile: Profile;
  transactions: Transaction[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
}

export function ProfilePage({ profile, transactions, onUpdateProfile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState({
    currentBalance: profile.currentBalance,
    monthlyIncome: profile.monthlyIncome,
  });

  const calculateSavingsRate = () => {
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return ((profile.monthlyIncome - monthlyExpenses) / profile.monthlyIncome * 100).toFixed(1);
  };

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Finanzprofil</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Wallet className="h-8 w-8" />
            <div className="flex-1">
              <p className="text-sm opacity-80">Monatliches Einkommen</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProfile.monthlyIncome}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    monthlyIncome: Number(e.target.value)
                  })}
                  className="w-full bg-white/10 rounded px-2 py-1 text-white"
                />
              ) : (
                <p className="text-2xl font-bold">€{profile.monthlyIncome.toFixed(2)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-80">Sparquote</p>
              <p className="text-2xl font-bold">{calculateSavingsRate()}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8" />
            <div className="flex-1">
              <p className="text-sm opacity-80">Aktueller Kontostand</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProfile.currentBalance}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    currentBalance: Number(e.target.value)
                  })}
                  className="w-full bg-white/10 rounded px-2 py-1 text-white"
                />
              ) : (
                <p className="text-2xl font-bold">€{profile.currentBalance.toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          {isEditing ? (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-white rounded-lg text-indigo-600 hover:bg-white/90"
              >
                Speichern
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
            >
              <Edit2 className="h-4 w-4" />
              Bearbeiten
            </button>
          )}
        </div>
      </div>

      {/* Financial Calendar */}
      <FinancialCalendar transactions={transactions} />

      {/* Total Expenses Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Gesamtausgaben</h2>
        <p className="text-3xl font-bold text-red-600 dark:text-red-400">€{totalExpenses.toFixed(2)}</p>
      </div>

      {/* Spending Chart */}
      <SpendingChart transactions={transactions} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SavingsGoals
          goals={profile.savingsGoals || []}
          onAddGoal={() => {}}
        />
        <CategoryManager
          categories={profile.categories || []}
          onAddCategory={() => {}}
          onUpdateCategory={() => {}}
        />
      </div>
    </div>
  );
}