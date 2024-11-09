import React from 'react';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, Transaction } from '../types/finance';

interface NotificationCenterProps {
  profile: Profile;
  transactions: Transaction[];
}

export function NotificationCenter({ profile, transactions }: NotificationCenterProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = React.useMemo(() => {
    const alerts = [];

    // Budget-Warnungen
    Object.entries(profile.budgetDistribution).forEach(([category, budget]) => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category?.type === category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (spent > budget * 0.9) {
        alerts.push({
          id: `budget-${category}`,
          type: 'warning',
          title: 'Budget fast ausgeschöpft',
          message: `Sie haben bereits ${Math.round((spent/budget) * 100)}% Ihres ${category}-Budgets verwendet.`,
          icon: AlertTriangle
        });
      }
    });

    // Sparziele-Tracking
    profile.savingsGoals.forEach(goal => {
      if (goal.currentAmount >= goal.targetAmount) {
        alerts.push({
          id: `goal-${goal.id}`,
          type: 'success',
          title: 'Sparziel erreicht!',
          message: `Gratulation! Sie haben Ihr Sparziel "${goal.name}" erreicht.`,
          icon: CheckCircle
        });
      }
    });

    return alerts;
  }, [profile, transactions]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Benachrichtigungen
              </h3>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.type === 'warning'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <notification.icon className="h-5 w-5 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-2">
                    Keine neuen Benachrichtigungen
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}