"use client";

import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet,
  TrendingUp,
  MoreVertical
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', income: 4000, expense: 2400 },
  { name: 'Tue', income: 3000, expense: 1398 },
  { name: 'Wed', income: 2000, expense: 9800 },
  { name: 'Thu', income: 2780, expense: 3908 },
  { name: 'Fri', income: 1890, expense: 4800 },
  { name: 'Sat', income: 2390, expense: 3800 },
  { name: 'Sun', income: 3490, expense: 4300 },
];

const recentTransactions = [
  { id: 1, title: "Salary", date: "Today, 09:00 AM", amount: "+$5,000.00", type: "income" },
  { id: 2, title: "Grocery", date: "Today, 10:30 AM", amount: "-$120.50", type: "expense" },
  { id: 3, title: "Electric Bill", date: "Yesterday, 14:00 PM", amount: "-$85.00", type: "expense" },
  { id: 4, title: "Freelance Work", date: "Oct 24, 2023", amount: "+$800.00", type: "income" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Overview</h2>
          <p className="text-gray-500 mt-1">Track your financial activities</p>
        </div>
        <button className="px-6 py-2.5 bg-gradient-premium text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/20">
          + Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Balance</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">$12,450.00</h3>
            </div>
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-accent-green mr-1" />
            <span className="text-accent-green font-medium">+2.5%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent-green/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Income</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">$5,800.00</h3>
            </div>
            <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center text-accent-green">
              <ArrowDownCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent-red/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Expense</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">$2,350.00</h3>
            </div>
            <div className="w-12 h-12 bg-accent-red/20 rounded-xl flex items-center justify-center text-accent-red">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-foreground">Cash Flow</h3>
            <select className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-primary-500">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
            <button className="text-gray-400 hover:text-foreground">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6 flex-1">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                  }`}>
                    {tx.type === 'income' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary-500 transition-colors">{tx.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className={`font-semibold ${tx.type === 'income' ? 'text-accent-green' : 'text-foreground'}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 text-sm font-semibold text-primary-500 bg-primary-500/10 hover:bg-primary-500/20 rounded-xl transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
