
import { useState } from 'react'
import { expenseCategories, incomeCategories } from '../data/categories'

const categories = {
  income: Object.entries(incomeCategories).map(([value, category]) => ({
    value,
    label: category.label,
  })),

  expense: Object.entries(expenseCategories).map(([value, category]) => ({
    value,
    label: category.label,
  })),
}

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function TransactionForm({
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
}) {
  return (
    <TransactionFormFields
      key={editingTransaction?.id ?? 'new'}
      onAddTransaction={onAddTransaction}
      onUpdateTransaction={onUpdateTransaction}
      editingTransaction={editingTransaction}
      onCancelEdit={onCancelEdit}
    />
  )
}

function TransactionFormFields({
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
}) {
  const [description, setDescription] = useState(
    editingTransaction?.description ?? ''
  )

  const [amount, setAmount] = useState(
    editingTransaction ? String(editingTransaction.amount) : ''
  )

  const [type, setType] = useState(
    editingTransaction?.type ?? 'expense'
  )

  const [category, setCategory] = useState(() => {
    if (!editingTransaction) {
      return 'other'
    }

    const transactionType = editingTransaction.type
    const availableCategories = categories[transactionType] || []
    const savedCategory = editingTransaction.category || 'other'

    const categoryExists = availableCategories.some(
      (item) => item.value === savedCategory
    )

    return categoryExists ? savedCategory : 'other'
  })

  const [date, setDate] = useState(
    editingTransaction?.date ?? getTodayDate
  )

  const [error, setError] = useState('')

  function handleTypeChange(event) {
    setType(event.target.value)
    setCategory('other')
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedDescription = description.trim()
    const parsedAmount = Number(amount)

    if (!trimmedDescription) {
      setError('Informe uma descrição válida.')
      return
    }

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      Math.abs(
        parsedAmount * 100 - Math.round(parsedAmount * 100)
      ) > 0.000001
    ) {
      setError('Informe um valor válido com até duas casas decimais.')
      return
    }

    if (!date) {
      setError('Selecione uma data para a transação.')
      return
    }

    const availableCategories = categories[type] || []

    const categoryExists = availableCategories.some(
      (item) => item.value === category
    )

    if (!categoryExists) {
      setError('Selecione uma categoria válida.')
      return
    }

    const transactionData = {
      id: editingTransaction
        ? editingTransaction.id
        : crypto.randomUUID(),
      description: trimmedDescription,
      amount: Math.round(parsedAmount * 100) / 100,
      type,
      category,
      date,
    }

    if (editingTransaction) {
      onUpdateTransaction(transactionData)
    } else {
      onAddTransaction(transactionData)
    }

    setDescription('')
    setAmount('')
    setType('expense')
    setCategory('other')
    setDate(getTodayDate())
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h2>
        {editingTransaction ? 'Editar transação' : 'Nova transação'}
      </h2>

      <div className="form-field">
        <label htmlFor="description">Descrição</label>

        <input
          id="description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: Supermercado"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="amount">Valor (R$)</label>

          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Ex.: 250.00"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="type">Tipo</label>

          <select
            id="type"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="category">Categoria</label>

          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories[type].map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="date">Data</label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>
      </div>

      {error && (
        <p role="alert" style={{ color: '#f87171', fontSize: '13px' }}>
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit">
          {editingTransaction
            ? 'Salvar alterações'
            : 'Adicionar transação'}
        </button>

        {editingTransaction && (
          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default TransactionForm
