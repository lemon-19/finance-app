import { useEffect, useState } from "react";
import { getIncome, addIncome, deleteIncome } from "../../api/income";
import { getIncomeTypes } from "../../api/userCategories/incomeTypes";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Income() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [income, setIncome] = useState([]);
  const [incomeTypes, setIncomeTypes] = useState([]);

  const [type, setType] = useState("");   // now dropdown
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Fetch income + income types
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [incomeList, types] = await Promise.all([
        getIncome(user.uid),
        getIncomeTypes(user.uid)
      ]);

      setIncome(incomeList);
      setIncomeTypes(types);
    };

    fetchData();
  }, [user]);

  const handleAdd = async () => {
    if (!type || !amount) return;

    await addIncome(user.uid, type, Number(amount), description);

    const updated = await getIncome(user.uid);
    setIncome(updated);

    setType("");
    setAmount("");
    setDescription("");
  };

  const handleDelete = async (id) => {
    await deleteIncome(id);
    setIncome(prev => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold mb-5">Income</h2>

      {/* Add Income Form */}
<div className="bg-white p-5 shadow rounded mb-5">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

    {/* Income Type Dropdown */}
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">Income Type</label>
      <select
        className="border border-gray-300 rounded px-3 py-2 w-full h-10"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Select Type</option>
        {incomeTypes.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
      {incomeTypes.length === 0 && (
        <p className="text-xs text-gray-600 mt-1">
          No types yet.{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => navigate("/settings")}
          >
            Add Income Types →
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
        Add Income
      </button>
    </div>

  </div>
</div>


      {/* Income List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {income.map((inc) => (
              <tr key={inc.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{inc.type}</td>
                <td className="py-2 px-4">₱{inc.amount}</td>
                <td className="py-2 px-4">{inc.description}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(inc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {income.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No income records yet.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
