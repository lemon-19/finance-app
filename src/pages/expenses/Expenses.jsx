import { useEffect, useState } from "react";
import { getExpenses, addExpense, deleteExpense } from "../../api/expenses";
import { getExpenseTypes } from "../../api/userCategories/expenseTypes";
import { useAuth } from "../../context/AuthContext";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Fetch expenses + categories
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [expensesData, categoriesData] = await Promise.all([
        getExpenses(user.uid),
        getExpenseTypes(user.uid),
      ]);

      setExpenses(expensesData);
      setCategories(categoriesData);
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
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold mb-5">Expenses</h2>

      {/* Add Expense Form */}
      <div className="bg-white p-5 shadow rounded mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

          {/* Category Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Category</label>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full h-10"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {categories.length === 0 && (
              <p className="text-xs text-gray-600 mt-1">
                No categories yet.{" "}
                <button
                  className="text-blue-600 underline"
                  onClick={() => navigate("/settings")}
                >
                  Add Expense Categories →
                </button>
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full h-10"
              placeholder="₱0.00"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full h-10"
              placeholder="Optional description"
            />
          </div>

          {/* Add Button */}
          <div className="flex flex-col">
            <button
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 text-white rounded px-5 py-2 h-10 w-full lg:w-auto"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
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
            {expenses.map(exp => (
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

            {expenses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No expense records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
