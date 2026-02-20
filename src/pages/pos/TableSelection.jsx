import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getTablesStatus, checkoutOrder, cancelOrder } from "../../api/axios";
import { LayoutGrid, RefreshCcw } from "lucide-react"; // ✅ เพิ่ม Icon ประดับ
import TableCard from "../../components/pos/TableCard";
import CheckoutModal from "../../components/pos/CheckoutModal";

const TableSelection = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleCancelTable = async (tableId, orderId) => {
    try {
      await cancelOrder(orderId);
      fetchTables();
    } catch (error) {
      console.error("ยกเลิกโต๊ะไม่สำเร็จ", error);
      alert("เกิดข้อผิดพลาดในการยกเลิกโต๊ะ");
    }
  };

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await getTablesStatus();
      setTables(response.data);
    } catch (error) {
      console.error("Fetch tables failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handlePayment = async (method) => {
    try {
      await checkoutOrder(selectedTable.orderId, { paymentMethod: method });
      setShowCheckout(false);
      fetchTables();
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-32 min-h-full">
      {/* Header Section - ปรับให้ดูเป็น Dashboard มากขึ้น */}
      <header className="px-2 flex justify-between items-end pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-orange-500 rounded-lg text-white">
              <LayoutGrid size={16} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter italic">
              Floor <span className="text-orange-500">Plan</span>
            </h2>
          </div>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            {tables.filter((t) => t.status === "busy").length}{" "}
            โต๊ะที่กำลังใช้บริการ
          </p>
        </div>

        {/* ปุ่ม Refresh เผื่อพนักงานอยากอัปเดตสถานะเอง */}
        <button
          onClick={fetchTables}
          className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 active:rotate-180 transition-all duration-500 shadow-sm"
        >
          <RefreshCcw size={18} />
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-300 font-black text-[10px] tracking-[0.4em] uppercase">
            Scanning Tables...
          </p>
        </div>
      ) : (
        /* ✅ Responsive Grid Logic:
           - มือถือจอเล็ก: 2 คอลัมน์ (เน้นปุ่มใหญ่จิ้มง่าย)
           - มือถือจอใหญ่: 3 คอลัมน์
           - Tablet: 4-5 คอลัมน์
           - Desktop: 6 คอลัมน์ขึ้นไป
        */
        <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 px-2 animate-in fade-in zoom-in-95 duration-500">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onNavigate={(id) => navigate(`order/${id}`)}
              onCheckout={(t) => {
                setSelectedTable(t);
                setShowCheckout(true);
              }}
              onCancelTable={handleCancelTable}
            />
          ))}
        </div>
      )}

      {/* สรุปสถานะสั้นๆ ท้ายหน้า */}
      {!loading && (
        <div className="px-4 mt-4">
          <div className="bg-zinc-100/50 rounded-3xl p-4 flex justify-around items-center border border-zinc-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-900 rounded-full" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Busy
              </span>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={showCheckout}
        table={selectedTable}
        onClose={() => setShowCheckout(false)}
        onPayment={handlePayment}
      />
    </div>
  );
};

export default TableSelection;
