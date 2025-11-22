import { useEffect, useState } from "react";
import { getExpenses, addExpense, deleteExpense } from "../../api/expenses";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Trash } from "lucide-react";

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await getExpenses(user.uid);
      setExpenses(data);
    };
    fetchData();
  }, [user]);

  const handleAdd = async () => {
    if (!category || !amount) return;
    await addExpense(user.uid, category, Number(amount), description);
    const updated = await getExpenses(user.uid);
    setExpenses(updated);
    setCategory("");
    setAmount("");
    setDescription("");
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold mb-5">Expenses</h2>

      <div className="bg-white p-5 shadow rounded mb-5 grid gap-3 md:grid-cols-4">
        <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button className="mt-5 md:mt-0" onClick={handleAdd}>Add Expense</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{exp.category}</td>
                <td className="py-2 px-4">₱{exp.amount}</td>
                <td className="py-2 px-4">{exp.description}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
