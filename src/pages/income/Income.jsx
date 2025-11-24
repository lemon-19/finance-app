import { useEffect, useState } from "react";
import { Trash, Plus, Pencil, CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getIncome, addIncome, updateIncome, deleteIncome } from "../../api/income";
import { getIncomeTypes } from "../../api/userCategories/incomeTypes";

export default function Income() {
  const { user } = useAuth();

  const [income, setIncome] = useState([]);
  const [incomeTypes, setIncomeTypes] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [form, setForm] = useState({
    type: "",
    amount: "",
    description: "",
    dueDate: "", // New field for loan due date
  });

  const [initialLoading, setInitialLoading] = useState(true);

  // --------------------- UTILS ---------------------
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0 }).format(amount);

  // --------------------- FETCH DATA ---------------------
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setInitialLoading(true);
      try {
        const [incData, typesData] = await Promise.all([getIncome(user.uid), getIncomeTypes(user.uid)]);
        setIncome(incData || []);
        setIncomeTypes(typesData || []);
      } catch (err) {
        console.error("Error fetching income:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // --------------------- FORM HANDLERS ---------------------
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddOrUpdate = async () => {
    try {
      if (!form.type || !form.amount) return;

      if (editingIncome) {
        await updateIncome(editingIncome.id, form);
        setIncome((prev) =>
          prev.map((i) => (i.id === editingIncome.id ? { ...i, ...form } : i))
        );
      } else {
        await addIncome(user.uid, form.type, Number(form.amount), form.description, form.dueDate);
        const updated = await getIncome(user.uid);
        setIncome(updated);
      }

      setModalOpen(false);
      setForm({ type: "", amount: "", description: "", dueDate: "" });
      setEditingIncome(null);
    } catch (err) {
      console.error("Error saving income:", err);
    }
  };

  const handleEdit = (inc) => {
    setEditingIncome(inc);
    setForm({
      type: inc.type,
      amount: inc.amount,
      description: inc.description,
      dueDate: inc.dueDate || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this income record?")) return;
    await deleteIncome(id);
    setIncome((prev) => prev.filter((i) => i.id !== id));
  };

  const totalIncome = income.reduce((acc, i) => acc + Number(i.amount), 0);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading income...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-linear-to-r from-green-50 to-green-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Income</h1>
            <p className="text-sm text-gray-600">Track and manage your earnings</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={18} /> Add Income
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-500 font-medium mb-2">Total Income</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-500 font-medium mb-2">Number of Records</p>
            <p className="text-3xl font-bold text-gray-900">{income.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-500 font-medium mb-2">Average Income</p>
            <p className="text-3xl font-bold text-gray-900">
              {income.length ? formatCurrency(totalIncome / income.length) : formatCurrency(0)}
            </p>
          </div>
        </div>

        {/* Income List Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Income List</h2>
          {income.length > 0 ? (
            <div className="space-y-3">
              {income.map((inc) => (
<div
  key={inc.id}
  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
>
  <div>
    <p className="font-semibold text-gray-900 mb-1">{inc.type}</p>
    <p className="text-sm text-gray-600 mb-1">{inc.description}</p>
    {inc.dueDate && (
      <p className="text-xs text-red-500">Due Date: {new Date(inc.dueDate).toLocaleDateString()}</p>
    )}
  </div>

  {/* Amount + Icons */}
  <div className="flex justify-between items-center mt-3 sm:mt-0 w-full sm:w-auto">
    <p className="text-xl font-bold text-gray-900">{formatCurrency(inc.amount)}</p>
    <div className="flex gap-2">
      <button
        onClick={() => handleEdit(inc)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit income"
      >
        <Pencil size={18} />
      </button>
      <button
        onClick={() => handleDelete(inc.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete income"
      >
        <Trash size={18} />
      </button>
    </div>
  </div>
</div>

              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CreditCard className="mx-auto text-gray-300 mb-4" size={56} />
              <p className="text-sm font-semibold text-gray-600">No income records yet</p>
              <p className="text-xs text-gray-400 mt-2">Start adding income to track your earnings</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingIncome ? "Edit Income" : "Add New Income"}</h2>
              <div className="flex flex-col gap-4">
                {/* Income Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Income Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    {incomeTypes.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Optional description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Due Date: Only show if type is Loan */}
                {form.type.toLowerCase() === "loan" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                  <button
                    onClick={() => { setModalOpen(false); setEditingIncome(null); setForm({ type: "", amount: "", description: "", dueDate: "" }); }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdate}
                    className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium transition-colors"
                  >
                    {editingIncome ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
