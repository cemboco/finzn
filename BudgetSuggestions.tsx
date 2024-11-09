import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction, Profile } from '../types/finance';

interface BudgetSuggestionsProps {
  profile: Profile;
  transactions: Transaction[];
  onUpdateBudget: (updates: Partial<Profile['budgetDistribution']>) => void;
}

export function BudgetSuggestions({ profile, transactions, onUpdateBudget }: BudgetSuggestionsProps) {
  const suggestions = React.useMemo(() => {
    const lastThreeMonths = new Date();
    lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);

    // Gruppiere Transaktionen nach Kategorien
    const spendingByCategory = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= lastThreeMonths)
      .reduce((acc, t) => {
        const category = t.category?.type || 'other';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Berechne durchschnittliche monatliche Ausgaben
    const monthlyAverages = Object.entries(spendingByCategory).reduce((acc, [category, total]) => {
      acc[category] = total / 3;
      return acc;
    }, {} as Record<string, number>);

    const suggestions = [];

    // Analysiere jede Budgetkategorie
    Object.entries(profile.budgetDistribution).forEach(([category, budget]) => {
      const avgSpending = monthlyAverages[category] || 0;
      const difference = avgSpending - budget;
      const percentageDiff = (difference / budget) * 100;

      if (Math.abs(percentageDiff) > 15) {
        const suggestedBudget = Math.round(avgSpending * 1.1); // 10% Puffer

        suggestions.push({
          id: `suggestion-${category}`,
          category,
          currentBudget: budget,
          suggestedBudget,
          difference: suggestedBudget - budget,
          reason: percentageDiff > 0 
            ? `Die durchschnittlichen Ausgaben in "${category}" übersteigen das Budget um ${Math.abs(percentageDiff).toFixed(1)}%.`
            : `Das Budget für "${category}" könnte um ${Math.abs(percentageDiff).toFixed(1)}% reduziert werden.`,
          severity: percentageDiff > 0 ? 'warning' : 'info',
          icon: percentageDiff > 0 ? TrendingUp : TrendingDown
        });
      }
    });

    return suggestions;
  }, [profile.budgetDistribution, transactions]);

  const handleApplySuggestion = (suggestion: typeof suggestions[0]) => {
    onUpdateBudget({
      [suggestion.category]: suggestion.suggestedBudget
    });
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Budget-Empfehlungen
        </h2>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              suggestion.severity === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <suggestion.icon className={`h-5 w-5 mt-0.5 ${
                  suggestion.severity === 'warning'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {suggestion.reason}
                  </p>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                    Aktuelles Budget: €{suggestion.currentBudget.toFixed(2)} →{' '}
                    Vorgeschlagen: €{suggestion.suggestedBudget.toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleApplySuggestion(suggestion)}
                className="ml-4 px-3 py-1 text-sm font-medium rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Anwenden
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}