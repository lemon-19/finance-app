import { useEffect, useState } from "react";
import { Trash, Plus, Pencil, CreditCard, Loader2, CheckCircle, Circle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getBills, addBill, deleteBill, updateBill, markBillAsPaid } from "../../api/bills";
import { getBillCategories } from "../../api/userCategories/billCategories";

export default function Bills() {
  const { user } = useAuth();

  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // --------------------- UTILS ---------------------
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);

  // --------------------- FETCH DATA ---------------------
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setInitialLoading(true);
      try {
        const [billsData, categoriesData] = await Promise.all([
          getBills(user.uid),
          getBillCategories(user.uid),
        ]);
        setBills(billsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --------------------- FILTERED DATA ---------------------
  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.dueDate);
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "week":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return (
      billDate >= startDate &&
      (!filterCategory || bill.category === filterCategory) &&
      (!filterStatus || bill.status === filterStatus) &&
      (!searchTerm || bill.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // --------------------- FORM HANDLERS ---------------------
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddOrUpdate = async () => {
    try {
      if (editingBill) {
        await updateBill(editingBill.id, form);
        setBills((prev) =>
          prev.map((b) => (b.id === editingBill.id ? { ...b, ...form } : b))
        );
      } else {
        await addBill(user.uid, form.name, Number(form.amount), form.dueDate, form.category);
        const updated = await getBills(user.uid);
        setBills(updated);
      }

      setModalOpen(false);
      setEditingBill(null);
      setForm({ name: "", amount: "", dueDate: "", category: "" });
    } catch (err) {
      console.error("Error saving bill:", err);
    }
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setForm({
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      category: bill.category,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    await deleteBill(id);
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  const handleTogglePaid = async (bill) => {
    try {
      const newStatus = bill.status === "paid" ? "unpaid" : "paid";
      await updateBill(bill.id, { status: newStatus });
      setBills((prev) =>
        prev.map((b) => (b.id === bill.id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error("Error toggling bill status:", err);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-linear-to-r from-amber-50 to-amber-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Bills</h1>
            <p className="text-sm text-gray-600">Manage your recurring payments</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={18} /> Add Bill
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>

          <input
            type="text"
            placeholder="Search bill name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bills Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Bills List</h2>
          {filteredBills.length > 0 ? (
            <div className="space-y-3">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-all ${
                    bill.status === "paid"
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className={`p-2.5 rounded-xl ${
                      bill.status === "paid" ? "bg-green-100" : "bg-orange-50"
                    }`}>
                      <CreditCard className={bill.status === "paid" ? "text-green-600" : "text-orange-600"} size={22} />
                    </div>
                    <div>
                      <p className={`font-semibold mb-1 ${
                        bill.status === "paid" ? "text-gray-600 line-through" : "text-gray-900"
                      }`}>
                        {bill.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">{bill.category}</p>
                      <p className="text-xs text-gray-500">Due: {bill.dueDate}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        bill.status === "paid" ? "text-green-600" : "text-orange-600"
                      }`}>
                        {bill.status === "paid" ? "Paid" : "Unpaid"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <p className={`text-xl font-bold ${
                      bill.status === "paid" ? "text-gray-500" : "text-gray-900"
                    }`}>
                      {formatCurrency(bill.amount)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePaid(bill)}
                        className={`p-2 rounded-lg transition-colors ${
                          bill.status === "paid"
                            ? "text-green-600 hover:bg-green-50"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                        title={bill.status === "paid" ? "Mark as unpaid" : "Mark as paid"}
                      >
                        {bill.status === "paid" ? <CheckCircle size={18} /> : <Circle size={18} />}
                      </button>
                      <button
                        onClick={() => handleEdit(bill)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit bill"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete bill"
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
              <p className="text-sm font-semibold text-gray-600">No bills yet</p>
              <p className="text-xs text-gray-400 mt-2">
                Add bills to track your recurring payments
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingBill ? "Edit Bill" : "Add New Bill"}
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bill Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter bill name"
                    value={form.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₱)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setEditingBill(null);
                      setForm({ name: "", amount: "", dueDate: "", category: "" });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdate}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
                  >
                    {editingBill ? "Update" : "Add"}
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