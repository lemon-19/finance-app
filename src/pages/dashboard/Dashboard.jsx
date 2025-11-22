
import { useEffect, useState } from "react";
import SummaryCard from "../../components/cards/SummaryCard";
import { DollarSign, CreditCard, FileText } from "lucide-react";
import ExpenseChart from "../../components/charts/ExpenseChart";
import { useAuth } from "../../context/AuthContext";
import { getExpenses } from "../../api/expenses";
import { getIncome } from "../../api/income";
import { getBills } from "../../api/bills";

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const [expData, incData, billsData] = await Promise.all([
        getExpenses(user.uid),
        getIncome(user.uid),
        getBills(user.uid),
      ]);
      setExpenses(expData);
      setIncome(incData);
      setBills(billsData);
    };
    fetchData();
  }, [user]);

  const totalIncome = income.reduce((acc, i) => acc + Number(i.amount), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const totalBills = bills.reduce((acc, b) => acc + Number(b.amount), 0);

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>
      <div className="grid gap-5 md:grid-cols-3 mb-10">
        <SummaryCard title="Total Income" value={`₱${totalIncome}`} icon={<DollarSign size={30} />} />
        <SummaryCard title="Total Expenses" value={`₱${totalExpenses}`} icon={<CreditCard size={30} />} />
        <SummaryCard title="Bills Due" value={`₱${totalBills}`} icon={<FileText size={30} />} />
      </div>
      <div className="bg-white p-5 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Expenses Chart</h2>
        <ExpenseChart expenses={expenses} />
      </div>
    </div>
  );
}
