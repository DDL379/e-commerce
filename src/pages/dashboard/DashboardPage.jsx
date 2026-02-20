import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getSalesSummary, getOrderHistory } from "../../api/axios";
import {
  Banknote,
  CreditCard,
  TrendingUp,
  History,
  ChevronRight,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import OrderDetailModal from "../../components/dashboard/OrderDetailModal";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, historyRes] = await Promise.all([
          getSalesSummary(),
          getOrderHistory(),
        ]);
        setSummary(summaryRes.data.data);
        setRecentOrders(historyRes.data.data.slice(0, 5));
      } catch (error) {
        console.error("Fetch dashboard data failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="font-black text-zinc-400 text-xs uppercase tracking-[0.3em] animate-pulse">
          Analyzing Data...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-32 max-w-2xl mx-auto">
      {/* Header - ปรับให้ดูพรีเมียมขึ้น */}
      <header className="px-2 pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-xl text-white">
            <LayoutDashboard size={20} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter italic">
            Dashboard
          </h2>
        </div>
        <p className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          รายงานวันที่{" "}
          {new Date().toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      {/* 💰 Revenue Cards */}
      <div className="grid grid-cols-1 gap-4 px-2">
        {/* Main Revenue - ปรับขนาดฟอนต์ให้ Dynamic */}
        <div className="bg-zinc-900 p-8 sm:p-10 rounded-[3rem] text-white shadow-2xl shadow-zinc-200 relative overflow-hidden transition-all active:scale-[0.98]">
          <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-[0.03] rotate-12" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-3 text-orange-400">
              Daily Total Revenue
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-orange-500 italic">
                ฿
              </span>
              <h3 className="text-5xl sm:text-6xl font-black italic tracking-tighter tabular-nums">
                {(summary?.totalRevenue ?? 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Breakdown - Cash & Transfer */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group active:bg-zinc-50 transition-colors">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Banknote className="text-green-500" size={24} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
              เงินสด
            </p>
            <p className="text-xl font-black text-zinc-900 tabular-nums">
              ฿{(summary?.cashTotal ?? 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group active:bg-zinc-50 transition-colors">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="text-blue-500" size={24} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
              เงินโอน
            </p>
            <p className="text-xl font-black text-zinc-900 tabular-nums">
              ฿{(summary?.transferTotal ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/daily-report")}
          className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-zinc-200 active:scale-95 transition-all mt-2"
        >
          ดูรายงานปิดยอดวันนี้
        </button>
      </div>

      {/* 📜 Recent Orders List */}
      <section className="mt-2 sm:mt-4">
        <div className="flex justify-between items-center mb-5 px-4 sm:px-6">
          <h4 className="text-lg font-black text-zinc-900 flex items-center gap-2 italic">
            <History size={20} className="text-orange-500" /> บิลล่าสุด
          </h4>
          <button
            onClick={() => navigate("/history")}
            className="text-[10px] font-black text-zinc-400 bg-zinc-100 px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-1 hover:text-orange-500 transition-all"
          >
            All <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-3 px-2">
          {recentOrders.length === 0 ? (
            <div className="bg-zinc-50 rounded-[3rem] p-16 text-center text-zinc-300 font-bold uppercase tracking-widest text-[10px] border-2 border-dashed border-zinc-100">
              ไม่มีรายการบิลในขณะนี้
            </div>
          ) : (
            recentOrders.map((order) => {
              const isCancelled = order.status === "CANCELLED";

              return (
                <div
                  key={order.id}
                  onClick={() => handleViewDetail(order)}
                  className={`group cursor-pointer p-4 sm:p-5 rounded-[2.5rem] border shadow-sm flex items-center justify-between transition-all active:scale-[0.97] ${
                    isCancelled
                      ? "bg-red-50/50 border-red-100"
                      : "bg-white border-gray-50 hover:border-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[1.5rem] flex items-center justify-center font-black text-lg shrink-0 transition-transform group-hover:rotate-6 ${
                        isCancelled
                          ? "bg-red-500 text-white shadow-lg shadow-red-100"
                          : "bg-zinc-900 text-white"
                      }`}
                    >
                      {order.tableNumber}
                    </div>
                    <div className="truncate">
                      <p
                        className={`font-black italic text-sm sm:text-base tracking-tight truncate ${isCancelled ? "text-red-600" : "text-zinc-900"}`}
                      >
                        Bill #
                        {order.billNumber || order.id.toString().slice(-4)}
                        {isCancelled && (
                          <span className="ml-2 text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded italic NOT-italic tracking-normal">
                            VOID
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold mt-0.5">
                        <Clock size={10} className="text-orange-400" />
                        {new Date(order.updatedAt).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        น.
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-black text-lg sm:text-xl tabular-nums ${isCancelled ? "text-red-500" : "text-zinc-900"}`}
                    >
                      ฿{Number(order.totalAmount).toLocaleString()}
                    </p>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${
                        isCancelled ? "text-red-400" : "text-green-500"
                      }`}
                    >
                      {isCancelled ? "CANCELLED" : order.paymentMethod}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default DashboardPage;
