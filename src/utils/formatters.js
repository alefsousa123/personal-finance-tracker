const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatDate(dateString) {
  if (!dateString) {
    return 'Sem data'
  }

  const [year, month, day] = dateString.split('-')

  if (!year || !month || !day) {
    return 'Data inválida'
  }

  return `${day}/${month}/${year}`
}