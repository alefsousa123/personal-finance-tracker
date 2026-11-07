import { expenseCategories as categories } from '../data/categories'
import {formatCurrency} from '../utils/formatters'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

 



function ExpenseChart({ transactions }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === 'expense'
  )

  const totalsByCategory = expenses.reduce(
    (totals, transaction) => {
      const category = categories[transaction.category]
        ? transaction.category
        : 'other'

      totals[category] =
        (totals[category] || 0) + transaction.amount

      return totals
    },
    {}
  )

  const chartData = Object.entries(totalsByCategory).map(
    ([category, amount]) => ({
      name: categories[category].label,
      value: amount,
      color: categories[category].color,
    })
  )

  const totalExpenses = expenses.reduce(
    (total, transaction) => total + transaction.amount,
    0
  )

  return (
    <section className="expense-chart">
      <div className="chart-heading">
        <div>
          <h2>Despesas por categoria</h2>
          <p>Distribuição das suas despesas cadastradas</p>
        </div>

        <strong>{formatCurrency(totalExpenses)}</strong>
      </div>

      {chartData.length === 0 ? (
        <p className="chart-empty">
          Cadastre uma despesa para visualizar o gráfico.
        </p>
      ) : (
        <div className="chart-layout">
          <div className="chart-visual">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            {chartData.map((item) => (
              <div className="legend-item" key={item.name}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                />

                <span>{item.name}</span>

                <strong>
                  {formatCurrency(item.value)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default ExpenseChart
