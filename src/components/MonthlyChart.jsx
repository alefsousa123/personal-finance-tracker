
import { formatCurrency } from '../utils/formatters'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const compactNumberFormatter = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function formatCompactNumber(value) {
  return compactNumberFormatter.format(value)
}

function getLastSixMonths() {
  const today = new Date()

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - (5 - index),
      1
    )

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')

    return {
      key: `${year}-${month}`,
      month: date.toLocaleDateString('pt-BR', {
        month: 'short',
        year: '2-digit',
      }),
      income: 0,
      expenses: 0,
    }
  })
}

function MonthlyChart({ transactions }) {
  const monthlyData = getLastSixMonths()

  transactions.forEach((transaction) => {
    if (!transaction.date) {
      return
    }

    const transactionMonth = transaction.date.slice(0, 7)

    const monthData = monthlyData.find(
      (item) => item.key === transactionMonth
    )

    if (!monthData) {
      return
    }

    if (transaction.type === 'income') {
      monthData.income += transaction.amount
    } else if (transaction.type === 'expense') {
      monthData.expenses += transaction.amount
    }
  })

  const hasData = monthlyData.some(
    (item) => item.income > 0 || item.expenses > 0
  )

  return (
    <section className="monthly-chart">
      <div className="monthly-chart-heading">
        <h2>Receitas x despesas</h2>
        <p>Comparativo dos últimos seis meses</p>
      </div>

      {!hasData ? (
        <p className="chart-empty">
          Cadastre transações com datas dos últimos seis meses
          para visualizar o gráfico.
        </p>
      ) : (
        <div className="monthly-chart-visual">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#334155"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCompactNumber}
                width={50}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f8fafc' }}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: '12px',
                  color: '#cbd5e1',
                }}
              />

              <Bar
                dataKey="income"
                name="Receitas"
                fill="#4ade80"
                radius={[5, 5, 0, 0]}
                maxBarSize={36}
              />

              <Bar
                dataKey="expenses"
                name="Despesas"
                fill="#f87171"
                radius={[5, 5, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default MonthlyChart
