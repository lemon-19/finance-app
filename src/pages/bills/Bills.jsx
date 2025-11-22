import { useEffect, useState } from "react";
import { getBills, addBill, deleteBill } from "../../api/bills";
import { getBillCategories } from "../../api/userCategories/billCategories";
import { useAuth } from "../../context/AuthContext";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Bills() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  // Fetch bills + categories
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [billsData, categoriesData] = await Promise.all([
        getBills(user.uid),
        getBillCategories(user.uid),
      ]);
      setBills(billsData);
      setCategories(categoriesData);
    };

    fetchData();
  }, [user]);

  const handleAdd = async () => {
    if (!name || !amount || !dueDate) return;
    await addBill(user.uid, name, Number(amount), dueDate, category);
    const updated = await getBills(user.uid);
    setBills(updated);
    setName("");
    setAmount("");
    setDueDate("");
    setCategory("");
  };

  const handleDelete = async (id) => {
    await deleteBill(id);
    setBills(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold mb-5">Bills</h2>

      {/* Add Bill Form */}
      <div className="bg-white p-5 shadow rounded mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          {/* Bill Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Bill Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full h-10"
              placeholder="Enter bill name"
            />
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

          {/* Due Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full h-10"
            />
          </div>

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
                  Add Bill Categories →
                </button>
              </p>
            )}
          </div>

          {/* Add Button */}
          <div className="flex flex-col">
            <button
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 text-white rounded px-5 py-2 h-10 w-full lg:w-auto"
            >
              Add Bill
            </button>
          </div>

        </div>
      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Bill Name</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Due Date</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{bill.name}</td>
                <td className="py-2 px-4">₱{bill.amount}</td>
                <td className="py-2 px-4">{bill.dueDate}</td>
                <td className="py-2 px-4">{bill.category}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(bill.id)} className="text-red-500 hover:text-red-700">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {bills.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No bills added yet.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
