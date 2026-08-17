"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  "เงินเดือน",
  "อาหาร",
  "เดินทาง",
  "บิลรายเดือน",
  "อื่นๆ"
];

export default function TransactionModal({ isOpen, onClose, onSuccess }: TransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl relative z-10 border border-gray-200 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-foreground">เพิ่มรายการใหม่</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income" })}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                  formData.type === "income"
                    ? "bg-accent-green/20 text-accent-green border-2 border-accent-green/50"
                    : "bg-background border-2 border-transparent text-gray-500 hover:bg-card-hover"
                }`}
              >
                รายรับ
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense" })}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                  formData.type === "expense"
                    ? "bg-accent-red/20 text-accent-red border-2 border-accent-red/50"
                    : "bg-background border-2 border-transparent text-gray-500 hover:bg-card-hover"
                }`}
              >
                รายจ่าย
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">ชื่อรายการ</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="เช่น ค่าอาหาร, เงินเดือน"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">จำนวนเงิน (บาท)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">วันที่</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 flex justify-center items-center gap-2 text-sm font-semibold text-white bg-gradient-premium rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 shadow-lg shadow-primary-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "บันทึกรายการ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
