import { useEffect, useState, useMemo } from "react";
import {
  Loader2, DollarSign, CreditCard, FileText, TrendingUp, TrendingDown,
  AlertCircle, Calendar, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getExpenses } from "../../api/expenses";
import { getIncome } from "../../api/income";
import { getBills } from "../../api/bills";

// ----------------------------------------------------------
// UTIL FUNCTIONS
// ----------------------------------------------------------

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
};

// ----------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------

export default function Dashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [bills, setBills] = useState([]);
  const [timeRange, setTimeRange] = useState("month");

  // ----------------------------------------------------------
  // FETCH ALL DATA ONCE
  // ----------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [exp, inc, bill] = await Promise.all([
          getExpenses(user.uid),
          getIncome(user.uid),
          getBills(user.uid),
        ]);

        // Since createdAt is already a Date object now, just convert to timestamp
        setExpenses(exp?.map((e) => ({ 
          ...e, 
          ts: e.createdAt instanceof Date ? e.createdAt.getTime() : new Date(e.createdAt).getTime() 
        })) || []);
        
        setIncome(inc?.map((i) => ({ 
          ...i, 
          ts: i.createdAt instanceof Date ? i.createdAt.getTime() : new Date(i.createdAt).getTime() 
        })) || []);
        
        setBills(bill || []);

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  // ----------------------------------------------------------
  // FILTER BY TIME RANGE (Memoized)
  // ----------------------------------------------------------

  const filteredData = useMemo(() => {
    if (!expenses.length && !income.length) return { expenses: [], income: [] };

    const now = new Date();
    let startDate;

    if (timeRange === "week") {
      startDate = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    } else if (timeRange === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    } else {
      startDate = new Date(now.getFullYear(), 0, 1).getTime();
    }

    return {
      expenses: expenses.filter((e) => e.ts >= startDate),
      income: income.filter((i) => i.ts >= startDate),
    };
  }, [timeRange, expenses, income]);

  const filteredExpenses = filteredData.expenses;
  const filteredIncome = filteredData.income;

  // ----------------------------------------------------------
  // PREVIOUS MONTH (Memoized)
  // ----------------------------------------------------------
  const previousPeriod = useMemo(() => {
    const now = new Date();
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0).getTime();

    const prevInc = income
      .filter((i) => i.ts >= prevStart && i.ts <= prevEnd)
      .reduce((a, i) => a + Number(i.amount), 0);

    const prevExp = expenses
      .filter((e) => e.ts >= prevStart && e.ts <= prevEnd)
      .reduce((a, e) => a + Number(e.amount), 0);

    return { income: prevInc, expenses: prevExp };
  }, [expenses, income]);

  // ----------------------------------------------------------
  // CALCULATED TOTALS (Memoized)
  // ----------------------------------------------------------

  const totals = useMemo(() => {
    const totalIncome = filteredIncome.reduce((a, i) => a + Number(i.amount), 0);
    const totalExpenses = filteredExpenses.reduce((a, e) => a + Number(e.amount), 0);

    const unpaidBills = bills.filter((b) => b.status === "unpaid");
    const paidBills = bills.filter((b) => b.status === "paid");

    const totalBills = unpaidBills.reduce((a, b) => a + Number(b.amount), 0);
    const totalPaidBills = paidBills.reduce((a, b) => a + Number(b.amount), 0);

    const balance = totalIncome - totalExpenses;
    const adjustedBalance = balance - totalPaidBills;

    return {
      totalIncome,
      totalExpenses,
      unpaidBills,
      totalBills,
      totalPaidBills,
      adjustedBalance,
    };
  }, [filteredIncome, filteredExpenses, bills]);

  const { totalIncome, totalExpenses, unpaidBills, totalBills, totalPaidBills, adjustedBalance } = totals;

  // ----------------------------------------------------------
  // TRENDS (Memoized)
  // ----------------------------------------------------------
  const incomeTrend = useMemo(() => {
    return previousPeriod.income
      ? (((totalIncome - previousPeriod.income) / previousPeriod.income) * 100).toFixed(1)
      : 0;
  }, [totalIncome, previousPeriod]);

  const expensesTrend = useMemo(() => {
    return previousPeriod.expenses
      ? (((totalExpenses - previousPeriod.expenses) / previousPeriod.expenses) * 100).toFixed(1)
      : 0;
  }, [totalExpenses, previousPeriod]);

  // ----------------------------------------------------------
  // UPCOMING BILLS (Memoized)
  // ----------------------------------------------------------
  const upcomingBills = useMemo(() => {
    const today = new Date();
    const now = today.getTime();

    return unpaidBills
      .filter((b) => {
        // Handle both Date objects and date strings
        const dueDate = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
        const due = dueDate.getTime();
        const diff = Math.ceil((due - now) / (1000 * 3600 * 24));
        return diff >= 0 && diff <= 7;
      })
      .sort((a, b) => {
        const dateA = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
        const dateB = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
        return dateA - dateB;
      });
  }, [unpaidBills]);

  // ----------------------------------------------------------
  // TOP CATEGORIES (Memoized)
  // ----------------------------------------------------------
  const topCategories = useMemo(() => {
    const categoryMap = {};

    filteredExpenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredExpenses]);

  // ----------------------------------------------------------
  // RECENT TRANSACTIONS (Memoized)
  // ----------------------------------------------------------
  const recentTransactions = useMemo(() => {
    const merged = [
      ...filteredExpenses.map((e) => ({ ...e, type: "expense" })),
      ...filteredIncome.map((i) => ({ ...i, type: "income" })),
    ];

    return merged.sort((a, b) => b.ts - a.ts).slice(0, 5);
  }, [filteredExpenses, filteredIncome]);

  // ----------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // MAIN JSX
  // ----------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
            <p className="text-sm text-gray-600">Your financial overview</p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm font-medium">Available Balance</p>
            <h2 className="text-3xl font-bold mt-1">{formatCurrency(adjustedBalance)}</h2>
            <p className="text-xs text-blue-200 mt-2">After all bills & expenses</p>
          </div>

          {/* Income */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <div className="flex justify-between mb-3">
              <ArrowUpRight className="text-green-600" size={22} />
              {incomeTrend !== 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${incomeTrend > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {incomeTrend > 0 ? "+" : ""}
                  {incomeTrend}%
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold">{formatCurrency(totalIncome)}</h2>
            <p className="text-sm text-gray-500">Total Income</p>
          </div>

          {/* Expenses */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <div className="flex justify-between mb-3">
              <ArrowDownRight className="text-red-600" size={22} />
              {expensesTrend !== 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${expensesTrend > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                  {expensesTrend > 0 ? "+" : ""}
                  {expensesTrend}%
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold">{formatCurrency(totalExpenses)}</h2>
            <p className="text-sm text-gray-500">Total Expenses</p>
          </div>

          {/* Bills */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <div className="flex justify-between mb-3">
              <FileText className="text-orange-600" size={22} />
              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">{unpaidBills.length} unpaid</span>
            </div>
            <h2 className="text-2xl font-bold">{formatCurrency(totalBills + totalPaidBills)}</h2>
            <p className="text-sm text-gray-500">Total Bills</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-red-600">Unpaid: {formatCurrency(totalBills)}</span>
              <span className="text-gray-400">|</span>
              <span className="text-green-600">Paid: {formatCurrency(totalPaidBills)}</span>
            </div>
          </div>

        </div>

        {/* Upcoming Bills & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Top Categories */}
          <div className="lg:col-span-2 bg-white p-7 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-6">Top Spending Categories</h2>

            {topCategories.length > 0 ? (
              topCategories.map(([cat, amt], idx) => {
                const percent = ((amt / totalExpenses) * 100).toFixed(1);
                return (
                  <div key={cat} className="mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{cat}</span>
                      <span>{formatCurrency(amt)}</span>
                    </div>

                    <div className="w-full bg-gray-100 h-3 rounded-full mt-1">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"][idx],
                        }}
                      ></div>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">{percent}% of expenses</p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <CreditCard className="mx-auto text-gray-300 mb-4" size={50} />
                <p className="text-sm text-gray-500">No expenses yet</p>
              </div>
            )}
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white p-7 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-6">Upcoming Bills</h2>

            {upcomingBills.length > 0 ? (
              upcomingBills.map((bill) => {
                const dueDate = bill.dueDate instanceof Date ? bill.dueDate : new Date(bill.dueDate);
                const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24));
                const urgent = daysLeft <= 3;

                return (
                  <div
                    key={bill.id}
                    className={`p-4 rounded-xl mb-3 shadow-sm ${
                      urgent ? "bg-red-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{bill.name}</span>
                      <span className="font-bold">{formatCurrency(bill.amount)}</span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{bill.category}</span>
                      <span className={urgent ? "text-red-600" : ""}>
                        Due in {daysLeft} {daysLeft === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <Calendar className="mx-auto text-gray-300 mb-3" size={50} />
                <p className="text-sm text-gray-500">No bills due soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-7 rounded-2xl shadow-md">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <button className="text-blue-600 text-sm">View All</button>
          </div>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 mb-2 rounded-xl hover:bg-gray-50 shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl ${
                      t.type === "income" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    {t.type === "income" ? (
                      <ArrowUpRight className="text-green-600" size={20} />
                    ) : (
                      <ArrowDownRight className="text-red-600" size={20} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      {t.type === "expense" ? t.category : "Income"}
                    </p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold text-sm ${t.type === "income" ? "text-green-600" : ""}`}>
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(t.ts)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <DollarSign className="mx-auto text-gray-300 mb-4" size={50} />
              <p className="text-sm text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}