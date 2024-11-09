import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, PiggyBank, Target } from 'lucide-react';
import { Transaction, Profile } from '../types/finance';
import { BudgetSuggestions } from './BudgetSuggestions';

interface DashboardProps {
  profile: Profile;
  transactions: Transaction[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
}

export function Dashboard({ profile, transactions, onUpdateProfile }: DashboardProps) {
  const getMonthlyAverage = () => {
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const months = new Set(transactions.map(t => t.date.substring(0, 7))).size;
    return months > 0 ? expenses / months : 0;
  };

  const handleUpdateBudget = (updates: Partial<Profile['budgetDistribution']>) => {
    onUpdateProfile({
      budgetDistribution: {
        ...profile.budgetDistribution,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktueller Kontostand</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                €{profile.currentBalance.toFixed(2)}
              </p>
            </div>
            <PiggyBank className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monatlicher Durchschnitt</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                €{getMonthlyAverage().toFixed(2)}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Letzte Einnahme</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                €{transactions.find(t => t.type === 'income')?.amount.toFixed(2) || '0.00'}
              </p>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Letzte Ausgabe</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                €{transactions.find(t => t.type === 'expense')?.amount.toFixed(2) || '0.00'}
              </p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      <BudgetSuggestions
        profile={profile}
        transactions={transactions}
        onUpdateBudget={handleUpdateBudget}
      />
    </div>
  );
}