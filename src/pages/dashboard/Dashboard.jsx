import { useEffect, useState } from "react";
import { 
  DollarSign, CreditCard, FileText, TrendingUp, TrendingDown, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getExpenses } from "../../api/expenses";
import { getIncome } from "../../api/income";
import { getBills } from "../../api/bills";

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [previousData, setPreviousData] = useState({
    income: 0,
    expenses: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [expData, incData, billsData] = await Promise.all([
          getExpenses(user.uid),
          getIncome(user.uid),
          getBills(user.uid),
        ]);
        
        setExpenses(expData || []);
        setIncome(incData || []);
        setBills(billsData || []);

        // Calculate previous period data for trend comparison
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        
        const prevIncome = incData?.filter(i => {
          const date = new Date(i.createdAt.seconds * 1000);
          return date >= previousMonthStart && date <= previousMonthEnd;
        }).reduce((acc, i) => acc + Number(i.amount), 0) || 0;
        
        const prevExpenses = expData?.filter(e => {
          const date = new Date(e.createdAt.seconds * 1000);
          return date >= previousMonthStart && date <= previousMonthEnd;
        }).reduce((acc, e) => acc + Number(e.amount), 0) || 0;
        
        setPreviousData({
          income: prevIncome,
          expenses: prevExpenses
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Filter data based on time range
  const filterByTimeRange = (data) => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let startDate;
    
    switch(timeRange) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.createdAt.seconds * 1000);
      return itemDate >= startDate;
    });
  };

  const filteredExpenses = filterByTimeRange(expenses);
  const filteredIncome = filterByTimeRange(income);

  // Bills based on status
  const unpaidBills = bills.filter(b => b.status === "unpaid");
  const paidBills = bills.filter(b => b.status === "paid");

  // Calculate totals
  const totalIncome = filteredIncome.reduce((acc, i) => acc + Number(i.amount), 0);
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const totalBills = unpaidBills.reduce((acc, b) => acc + Number(b.amount), 0);
  const balance = totalIncome - totalExpenses;

  // Adjust balance for paid bills
  const totalPaidBills = paidBills.reduce((acc, b) => acc + Number(b.amount), 0);
  const adjustedBalance = balance - totalPaidBills;

  const savingsRate = totalIncome > 0 ? ((adjustedBalance / totalIncome) * 100).toFixed(1) : 0;

  // Calculate trends
  const incomeTrend = previousData.income > 0 
    ? (((totalIncome - previousData.income) / previousData.income) * 100).toFixed(1)
    : 0;
  const expensesTrend = previousData.expenses > 0
    ? (((totalExpenses - previousData.expenses) / previousData.expenses) * 100).toFixed(1)
    : 0;

  // Upcoming bills (next 7 days) - unpaid only
  const upcomingBills = unpaidBills
    .filter(bill => {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Calculate expense by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent transactions
  const recentTransactions = [
    ...filteredExpenses.slice(0, 3).map(e => ({ ...e, type: 'expense' })),
    ...filteredIncome.slice(0, 2).map(i => ({ ...i, type: 'income' }))
  ].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds).slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysInRange = () => {
    switch(timeRange) {
      case 'week': return 7;
      case 'month': return 30;
      case 'year': return 365;
      default: return 30;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-linear-to-r from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back! 👋</h1>
              <p className="text-sm text-gray-600">
                Here's what's happening with your finances today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:bg-gray-50 transition-colors"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-blue-100 text-sm font-medium">Current Balance</p>
              <TrendingUp className="text-blue-200" size={20} />
            </div>
            <h2 className="text-3xl font-bold mb-2">{formatCurrency(adjustedBalance)}</h2>
            <p className="text-blue-100 text-xs">Net worth this {timeRange === 'week' ? 'week' : timeRange === 'month' ? 'month' : 'year'}</p>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-green-50 rounded-xl">
                <ArrowUpRight className="text-green-600" size={22} />
              </div>
              {incomeTrend !== 0 && (
                <span className={`text-xs font-semibold ${Number(incomeTrend) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2.5 py-1 rounded-full`}>
                  {Number(incomeTrend) >= 0 ? '+' : ''}{incomeTrend}%
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1.5">{formatCurrency(totalIncome)}</h3>
            <p className="text-sm text-gray-500 font-medium">Total Income</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <ArrowDownRight className="text-red-600" size={22} />
              </div>
              {expensesTrend !== 0 && (
                <span className={`text-xs font-semibold ${Number(expensesTrend) >= 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'} px-2.5 py-1 rounded-full`}>
                  {Number(expensesTrend) >= 0 ? '+' : ''}{expensesTrend}%
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1.5">{formatCurrency(totalExpenses)}</h3>
            <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
          </div>

          {/* Bills Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-orange-50 rounded-xl">
                <FileText className="text-orange-600" size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                {unpaidBills.length} bills
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1.5">{formatCurrency(totalBills)}</h3>
            <p className="text-sm text-gray-500 font-medium">Bills Due</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="text-purple-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Savings Rate</p>
                <p className="text-2xl font-bold text-gray-900">{savingsRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="text-blue-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Avg Daily Spend</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalExpenses / getDaysInRange())}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <AlertCircle className="text-yellow-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Budget Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(Math.max(0, adjustedBalance))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-7 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Spending Categories</h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Year'}
              </span>
            </div>
            {topCategories.length > 0 ? (
              <div className="space-y-5">
                {topCategories.map(([category, amount], index) => {
                  const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-sm font-semibold text-gray-700">{category}</span>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 font-medium">{percentage}% of total expenses</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <CreditCard className="mx-auto text-gray-300 mb-4" size={56} />
                <p className="text-sm font-semibold text-gray-600">No expenses recorded yet</p>
                <p className="text-xs text-gray-400 mt-2">Start tracking your spending to see insights</p>
              </div>
            )}
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Bills</h2>
              {upcomingBills.length > 0 && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-full">
                  {upcomingBills.length} due soon
                </span>
              )}
            </div>
            {upcomingBills.length > 0 ? (
              <div className="space-y-3">
                {upcomingBills.map(bill => {
                  const dueDate = new Date(bill.dueDate);
                  const today = new Date();
                  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntilDue <= 3;

                  return (
                    <div key={bill.id} className={`p-4 rounded-xl border-2 transition-all duration-200 ${isUrgent ? 'bg-red-50 border-red-200 hover:border-red-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{bill.name}</h3>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(bill.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">{bill.category}</span>
                        <span className={`text-xs font-semibold ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
                          Due in {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-300 mb-3" size={52} />
                <p className="text-sm font-semibold text-gray-600">No bills due soon</p>
                <p className="text-xs text-gray-400 mt-1">All clear for the next 7 days</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7 hover:shadow-lg transition-shadow duration-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map(transaction => (
                <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-150 border border-transparent hover:border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="text-green-600" size={20} />
                      ) : (
                        <ArrowDownRight className="text-red-600" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {transaction.type === 'income' ? transaction.type : transaction.category}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <DollarSign className="mx-auto text-gray-300 mb-4" size={56} />
              <p className="text-sm font-semibold text-gray-600">No transactions yet</p>
              <p className="text-xs text-gray-400 mt-2">Add income or expenses to see your activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
