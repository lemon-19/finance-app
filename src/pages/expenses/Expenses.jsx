import { useEffect, useState } from "react";
import { Trash, Plus, Pencil, CreditCard, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getExpenses,
  getExpensesPaginated,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../api/expenses";
import { getExpenseTypes } from "../../api/userCategories/expenseTypes";

export default function Expenses() {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  // Pagination states
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // --------------------- UTILS ---------------------
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp) =>
    new Date(timestamp.seconds * 1000).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // --------------------- FETCH DATA ---------------------
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setInitialLoading(true);
      try {
        const [expData, catData] = await Promise.all([
          getExpensesPaginated(user.uid, ITEMS_PER_PAGE),
          getExpenseTypes(user.uid),
        ]);
        
        setExpenses(expData?.expenses || []);
        setLastVisible(expData?.lastVisible || null);
        setHasMore(expData?.expenses?.length === ITEMS_PER_PAGE);
        setCategories(catData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Load more expenses
  const loadMoreExpenses = async () => {
    if (!hasMore || loadingMore || !lastVisible) return;

    setLoadingMore(true);
    try {
      const moreData = await getExpensesPaginated(
        user.uid,
        ITEMS_PER_PAGE,
        lastVisible
      );

      if (moreData?.expenses && moreData.expenses.length > 0) {
        setExpenses((prev) => [...prev, ...moreData.expenses]);
        setLastVisible(moreData.lastVisible);
        setHasMore(moreData.expenses.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more expenses:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // --------------------- FILTERED DATA ---------------------
  const filteredExpenses = expenses.filter((e) => {
    const expDate = new Date(e.createdAt.seconds * 1000);
    let startDate;
    const now = new Date();
    switch (timeRange) {
      case "week":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
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
      expDate >= startDate &&
      (!filterCategory || e.category === filterCategory) &&
      (!searchTerm ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const totalExpenses = filteredExpenses.reduce(
    (acc, e) => acc + Number(e.amount),
    0
  );

  // --------------------- FORM HANDLERS ---------------------
  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddOrUpdate = async () => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, form);
        setExpenses((prev) =>
          prev.map((e) => (e.id === editingExpense.id ? { ...e, ...form } : e))
        );
      } else {
        const newExpId = await addExpense(
          user.uid,
          form.category,
          Number(form.amount),
          form.description,
          form.date
        );
        
        // Refresh first page to show new expense
        const refreshData = await getExpensesPaginated(user.uid, ITEMS_PER_PAGE);
        setExpenses(refreshData?.expenses || []);
        setLastVisible(refreshData?.lastVisible || null);
        setHasMore(refreshData?.expenses?.length === ITEMS_PER_PAGE);
      }
      setModalOpen(false);
      setForm({ amount: "", category: "", description: "", date: "" });
      setEditingExpense(null);
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setForm({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: new Date(expense.createdAt.seconds * 1000)
        .toISOString()
        .split("T")[0],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-linear-to-r from-red-50 to-orange-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Expenses</h1>
              <p className="text-sm text-gray-600">
                Track and manage your spending
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <Plus size={18} /> Add Expense
            </button>
          </div>
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
          <input
            type="text"
            placeholder="Search description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-500 font-medium mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-500 font-medium mb-2">Number of Expenses</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredExpenses.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-500 font-medium mb-2">Average Expense</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredExpenses.length
                ? formatCurrency(totalExpenses / filteredExpenses.length)
                : formatCurrency(0)}
            </p>
          </div>
        </div>

        {/* Expenses Table/List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Expenses List</h2>
          {filteredExpenses.length > 0 ? (
            <>
              <div className="space-y-3">
                {filteredExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-4 mb-3 sm:mb-0">
                      <div className="p-2.5 bg-red-50 rounded-xl">
                        <CreditCard className="text-red-600" size={22} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {exp.category}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          {exp.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(exp.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(exp.amount)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit expense"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete expense"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !searchTerm && !filterCategory && timeRange === 'month' && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreExpenses}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Loading more...
                      </>
                    ) : (
                      <>
                        <ChevronRight size={18} />
                        Load More
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* End of list message */}
              {!hasMore && expenses.length > ITEMS_PER_PAGE && (
                <p className="text-center text-sm text-gray-500 mt-6">
                  You've reached the end of your expenses list
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <CreditCard className="mx-auto text-gray-300 mb-4" size={56} />
              <p className="text-sm font-semibold text-gray-600">
                No expenses yet
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Start adding expenses to track your spending
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
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </h2>
              <div className="flex flex-col gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder="What did you spend on?"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setEditingExpense(null);
                      setForm({ amount: "", category: "", description: "", date: "" });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdate}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
                  >
                    {editingExpense ? "Update" : "Add"}
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