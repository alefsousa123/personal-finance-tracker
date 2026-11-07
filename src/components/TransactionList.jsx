
import { useState } from 'react'
import { expenseCategories, incomeCategories } from '../data/categories'
import { formatCurrency, formatDate } from '../utils/formatters'

const categoryLabels = {
  income: Object.fromEntries(
    Object.entries(incomeCategories).map(([key, category]) => [
      key,
      category.label,
    ])
  ),

  expense: Object.fromEntries(
    Object.entries(expenseCategories).map(([key, category]) => [
      key,
      category.label,
    ])
  ),
}

function TransactionList({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
}) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      filter === 'all' || transaction.type === filter

    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())

    const matchesStartDate =
      !startDate ||
      (transaction.date && transaction.date >= startDate)

    const matchesEndDate =
      !endDate ||
      (transaction.date && transaction.date <= endDate)

    return (
      matchesType &&
      matchesSearch &&
      matchesStartDate &&
      matchesEndDate
    )
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1

    return sortOrder === 'newest'
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date)
  })

  function handleStartDateChange(event) {
    const newStartDate = event.target.value

    setStartDate(newStartDate)

    if (endDate && newStartDate && endDate < newStartDate) {
      setEndDate('')
    }
  }

  return (
    <section className="transaction-history">
      <h2>Histórico de transações</h2>

      <div className="history-filters">
        <div className="history-field">
          <label htmlFor="transaction-search">
            Buscar transação
          </label>

          <input
            id="transaction-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Digite uma descrição..."
          />
        </div>

        <div className="history-filter-grid">
          <div className="history-field">
            <label htmlFor="transaction-filter">Tipo</label>

            <select
              id="transaction-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>

          <div className="history-field">
            <label htmlFor="sort-order">Ordenar por</label>

            <select
              id="sort-order"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
            </select>
          </div>

          <div className="history-field">
            <label htmlFor="start-date">Data inicial</label>

            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>

          <div className="history-field">
            <label htmlFor="end-date">Data final</label>

            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="history-results">
        <p>
          {sortedTransactions.length}{' '}
          {sortedTransactions.length === 1
            ? 'transação encontrada'
            : 'transações encontradas'}
        </p>
      </div>

      {sortedTransactions.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        <ul className="transaction-items">
          {sortedTransactions.map((transaction) => (
            <li className="transaction-item" key={transaction.id}>
              <div className="transaction-info">
                <strong>{transaction.description}</strong>

                <span>
                  {categoryLabels[transaction.type]?.[
                    transaction.category
                  ] || 'Outros'}
                  {' · '}
                  {formatDate(transaction.date)}
                </span>

                <span>
                  {transaction.type === 'income'
                    ? 'Receita'
                    : 'Despesa'}
                </span>
              </div>

              <div className="transaction-details">
                <span
                  className={
                    transaction.type === 'income'
                      ? 'transaction-amount income'
                      : 'transaction-amount expense'
                  }
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>

                <div className="transaction-actions">
                  <button
                    type="button"
                    onClick={() => onEditTransaction(transaction)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(transaction.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TransactionList
