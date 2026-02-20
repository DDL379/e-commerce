import { useState, useEffect } from "react";
import { getOrderHistory } from "../../api/axios";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  Clock,
  CalendarDays,
} from "lucide-react";
import OrderDetailModal from "../../components/dashboard/OrderDetailModal";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [filterType, selectedDate]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getOrderHistory(filterType, selectedDate);
      setOrders(response.data.data);
    } catch (error) {
      console.error("Fetch history failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustDate = (offset) => {
    const newDate = new Date(selectedDate);
    if (filterType === "daily") {
      newDate.setDate(selectedDate.getDate() + offset);
    } else {
      newDate.setMonth(selectedDate.getMonth() + offset);
    }
    setSelectedDate(newDate);
  };

  const formatDateLabel = () => {
    if (filterType === "daily") {
      return selectedDate.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });
    }
    return selectedDate.toLocaleDateString("th-TH", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-32 max-w-2xl mx-auto px-2 sm:px-0">
      <header className="px-2 pt-4 sm:pt-6">
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tighter italic">
          Order <span className="text-orange-500">History</span>
        </h2>

        {/* Filter Type Toggle - ปรับให้ดูเป็น Tabs ที่กดง่าย */}
        <div className="flex bg-zinc-100 p-1 rounded-2xl mt-6">
          <button
            onClick={() => setFilterType("daily")}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${filterType === "daily" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400"}`}
          >
            รายวัน
          </button>
          <button
            onClick={() => setFilterType("monthly")}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${filterType === "monthly" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400"}`}
          >
            รายเดือน
          </button>
        </div>
      </header>

      {/* Date Selector Control - ปรับให้กดถนัดมือ */}
      <div className="px-2">
        <div className="bg-zinc-900 text-white rounded-[2rem] p-2 flex items-center justify-between shadow-xl shadow-zinc-200">
          <button
            onClick={() => handleAdjustDate(-1)}
            className="p-4 hover:bg-white/10 rounded-2xl transition-colors active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-400 mb-0.5">
              {filterType === "daily" ? "Selected Date" : "Selected Month"}
            </span>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-zinc-500" />
              <span className="text-lg font-black italic">
                {formatDateLabel()}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleAdjustDate(1)}
            className="p-4 hover:bg-white/10 rounded-2xl transition-colors active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-zinc-100 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-zinc-300 font-black text-[10px] tracking-widest uppercase">
              Fetching Records...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-100">
            <ReceiptText size={48} className="mx-auto mb-4 text-zinc-200" />
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
              ไม่พบรายการบิลในช่วงเวลานี้
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isCancelled = order.status === "CANCELLED";

            return (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                }}
                className={`group p-4 sm:p-5 rounded-[2.5rem] border shadow-sm flex justify-between items-center transition-all cursor-pointer active:scale-[0.97] ${
                  isCancelled
                    ? "bg-red-50/50 border-red-100"
                    : "bg-white border-zinc-50 hover:border-zinc-900"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                      isCancelled
                        ? "bg-red-500 text-white"
                        : "bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors"
                    }`}
                  >
                    {order.tableNumber}
                  </div>
                  <div className="truncate">
                    <h4
                      className={`font-black text-sm sm:text-base italic tracking-tight truncate ${
                        isCancelled
                          ? "text-red-600 line-through"
                          : "text-zinc-900"
                      }`}
                    >
                      Bill #{order.billNumber || order.id.toString().slice(-4)}
                      {isCancelled && (
                        <span className="ml-2 text-[8px] NOT-italic font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-normal">
                          Void
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-zinc-400 font-bold uppercase">
                      <Clock size={10} className="text-orange-500" />
                      {new Date(order.updatedAt).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      น.
                      {filterType === "monthly" && (
                        <span className="ml-1 flex items-center gap-1 border-l pl-2 border-zinc-200">
                          <CalendarDays size={10} />
                          {new Date(order.updatedAt).getDate()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-black text-lg tabular-nums ${isCancelled ? "text-red-500" : "text-zinc-900"}`}
                  >
                    ฿{Number(order.totalAmount).toLocaleString()}
                  </p>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest ${isCancelled ? "text-red-400" : "text-green-500"}`}
                  >
                    {isCancelled ? "Cancelled" : order.paymentMethod}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderHistoryPage;
