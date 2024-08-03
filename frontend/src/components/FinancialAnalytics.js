import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const FinancialAnalytics = ({ data, view, handleToggleView, handleMonthChange, handleYearChange, selectedMonth, selectedYear }) => {
  // Total income and expenses
  const incomeTotal = data.income; // Single value
  const expensesTotal = data.expenses; // Single value

  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      label: 'Financial Overview',
      data: [incomeTotal, expensesTotal],
      backgroundColor: ['#4BC0C0', '#FF9F40']
    }]
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Financial Analytics</h1>

      <div className="mb-4">
        {view === 'monthly' && (
          <div className="flex items-center">
            <label className="mr-4">
              Month:
              <input
                type="number"
                value={selectedMonth}
                onChange={handleMonthChange}
                min="1"
                max="12"
                className="ml-2 border p-1"
              />
            </label>
            <label>
              Year:
              <input
                type="number"
                value={selectedYear}
                onChange={handleYearChange}
                className="ml-2 border p-1"
              />
            </label>
          </div>
        )}

        {view === 'yearly' && (
          <div className="mt-4">
            <label>
              Year:
              <input
                type="number"
                value={selectedYear}
                onChange={handleYearChange}
                className="ml-2 border p-1"
              />
            </label>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Income vs Expenses</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default FinancialAnalytics;
