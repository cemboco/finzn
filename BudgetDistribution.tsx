import React from 'react';
import { Profile } from '../types/finance';

interface BudgetDistributionProps {
  profile: Profile;
}

export function BudgetDistribution({ profile }: BudgetDistributionProps) {
  const categories = [
    { name: 'Fixkosten', percentage: 50, amount: profile.monthlyIncome * 0.5, color: 'bg-blue-500' },
    { name: 'Bedürfnisse', percentage: 30, amount: profile.monthlyIncome * 0.3, color: 'bg-green-500' },
    { name: 'Wünsche', percentage: 10, amount: profile.monthlyIncome * 0.1, color: 'bg-yellow-500' },
    { name: 'Sparen/Investieren', percentage: 10, amount: profile.monthlyIncome * 0.1, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Budget Verteilung</h2>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                €{category.amount.toFixed(2)} ({category.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`${category.color} h-2.5 rounded-full`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}