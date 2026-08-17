"use client";

import { useEffect, useState } from "react";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet,
  TrendingUp,
  MoreVertical,
  Loader2,
  Trash2,
  X
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
import TransactionModal from "@/components/TransactionModal";

// Utility to format THB
const formatTHB = (amount: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
};

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, totalBalance: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [filter, setFilter] = useState("month");

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTransactions = async (currentFilter: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transactions?filter=${currentFilter}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setSummary(data.summary);
        
        const grouped = data.transactions.reduce((acc: any, tx: any) => {
          let dateKey = "";
          const d = new Date(tx.date);
          if (currentFilter === "year") {
            dateKey = d.toLocaleDateString('th-TH', { month: 'short' });
          } else {
            dateKey = d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric' });
          }

          if (!acc[dateKey]) {
            acc[dateKey] = { name: dateKey, income: 0, expense: 0 };
          }
          if (tx.type === 'income') acc[dateKey].income += tx.amount;
          else acc[dateKey].expense += tx.amount;
          return acc;
        }, {});
        
        const cData = Object.values(grouped).reverse();
        setChartData(cData.length > 0 ? cData : [{ name: 'Today', income: 0, expense: 0 }]);
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(filter);
  }, [filter]);

  const confirmDelete = (tx: any) => {
    setTransactionToDelete(tx);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/transactions/${transactionToDelete._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        setTransactionToDelete(null);
        fetchTransactions(filter); // Refresh data
      }
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">ภาพรวม (Overview)</h2>
          <p className="text-gray-500 mt-1">ติดตามรายการเคลื่อนไหวทางการเงินของคุณ</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-gradient-premium text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/20 flex items-center gap-2"
        >
          <span>+</span> เพิ่มรายการ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 text-sm font-medium">ยอดคงเหลือรวม</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{formatTHB(summary.totalBalance)}</h3>
                </div>
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent-green/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-gray-500 text-sm font-medium">รายรับทั้งหมด</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{formatTHB(summary.totalIncome)}</h3>
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
                  <p className="text-gray-500 text-sm font-medium">รายจ่ายทั้งหมด</p>
                  <h3 className="text-3xl font-bold text-foreground mt-2">{formatTHB(summary.totalExpense)}</h3>
                </div>
                <div className="w-12 h-12 bg-accent-red/20 rounded-xl flex items-center justify-center text-accent-red">
                  <ArrowUpCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">กระแสเงินสด</h3>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  <option value="week">รายสัปดาห์ (7 วัน)</option>
                  <option value="month">รายเดือน (30 วัน)</option>
                  <option value="year">รายปี (365 วัน)</option>
                </select>
              </div>
              <div className="h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(value: any) => formatTHB(Number(value) || 0)}
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
                <h3 className="text-xl font-bold text-foreground">รายการทั้งหมด</h3>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2">
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">ยังไม่มีรายการ</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between group p-2 hover:bg-card-hover rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                          tx.type === 'income' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                        }`}>
                          {tx.type === 'income' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{tx.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{tx.category} • {new Date(tx.date).toLocaleDateString('th-TH')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`font-semibold shrink-0 ${tx.type === 'income' ? 'text-accent-green' : 'text-foreground'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatTHB(tx.amount)}
                        </div>
                        <button 
                          onClick={() => confirmDelete(tx)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Transaction Modal */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchTransactions(filter)}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl relative z-10 border border-gray-200 dark:border-gray-800 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-foreground mb-2">ยืนยันการลบรายการ</h3>
            <p className="text-gray-500 text-sm mb-6">
              คุณต้องการลบรายการ <span className="font-semibold text-foreground">{transactionToDelete?.title}</span> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors flex items-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
