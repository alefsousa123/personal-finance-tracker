import { formatCurrency } from '../utils/formatters'

function SummaryCard({ title, amount }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{formatCurrency(amount)}</p>
    </div>
  )
}

export default SummaryCard