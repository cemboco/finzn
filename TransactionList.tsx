import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Tag } from 'lucide-react';
import { Transaction } from '../types/finance';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Transaktionen</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {transactions.slice(0, 10).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="h-8 w-8 text-green-500" />
              ) : (
                <ArrowDownCircle className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(transaction.date).toLocaleDateString()}
                  {transaction.category && ` • ${transaction.category.name}`}
                </p>
                {transaction.tags && transaction.tags.length > 0 && (
                  <div className="flex items-center mt-1 space-x-1">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex gap-1">
                      {transaction.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`font-medium ${
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toFixed(2)}
              </span>
              <button
                onClick={() => onDelete(transaction.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}