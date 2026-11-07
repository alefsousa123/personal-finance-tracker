
import SummaryCard from './SummaryCard';

function SummaryCards({ balance, income, expenses }) {
    return (
        <section>
            <SummaryCard title="Saldo Atual" amount={balance} />
            <SummaryCard title="Receitas" amount={income} />
            <SummaryCard title="Despesas" amount={expenses} />
        </section>
    );
    


}

export default SummaryCards;