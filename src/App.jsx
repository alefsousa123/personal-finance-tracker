
import { useState, useEffect } from 'react'
import './App.css'

import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import ExpenseChart from './components/ExpenseChart'
import MonthlyChart from './components/MonthlyChart'


function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions')

      if (!savedTransactions) {
        return []
      }

      const parsedTransactions = JSON.parse(savedTransactions)

      return Array.isArray(parsedTransactions) ? parsedTransactions : []
    } catch (error) {
      console.error('Error loading transactions:', error)
      return []
    }
  })

  const [editingTransaction, setEditingTransaction] = useState(null)

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  function handleAddTransaction(transaction) {
    setTransactions((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ])
  }

  function handleDeleteTransaction(id) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== id
      )
    )

    if (editingTransaction?.id === id) {
      setEditingTransaction(null)
    }
  }

  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction)
  }

  function handleUpdateTransaction(updatedTransaction) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    )

    setEditingTransaction(null)
  }

  function handleCancelEdit() {
    setEditingTransaction(null)
  }

  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const balance = income - expenses

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard">
        <div className="page-heading">
          <h2>Visão geral</h2>
          <p>Acompanhe suas receitas e despesas em um só lugar.</p>
        </div>

        <div className="summary-panel">
          <SummaryCards
            balance={balance}
            income={income}
            expenses={expenses}
          />
        </div>

        <div className="charts-panel">
          <div className="charts-grid">
            <ExpenseChart transactions={transactions} />
            <MonthlyChart transactions={transactions} />
          </div>
        </div>

        <div className="form-panel">
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            editingTransaction={editingTransaction}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <div className="history-panel">
          <TransactionList
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
          />
        </div>
      </main>
    </div>
  )
}

export default App
