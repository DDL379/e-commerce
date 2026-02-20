import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getDailyReport } from "../../api/axios";
import {
  Banknote,
  CreditCard,
  ShoppingBag,
  XCircle,
  ChevronLeft,
  CalendarDays,
  ArrowDownToLine,
} from "lucide-react";

const DailyReportPage = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await getDailyReport(new Date());
      setReport(res.data.data);
    } catch (error) {
      console.error("Report failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-zinc-100 border-t-orange-500 rounded-full animate-spin" />
        <p className="font-black text-zinc-300 text-[10px] uppercase tracking-[0.4em]">
          Calculating Totals...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 pb-32 max-w-2xl mx-auto px-2 sm:px-0">
      {/* Header - เพิ่มปุ่มย้อนกลับให้เด่นและตำแหน่งที่ดีขึ้น */}
      <header className="flex items-center gap-4 pt-4 sm:pt-6">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 active:scale-90 shadow-sm transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
            สรุปยอด <span className="text-orange-500 italic">ประจำวัน</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <CalendarDays size={12} className="text-zinc-400" />
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
              {new Date().toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* 💰 Grand Total Revenue - ปรับดีไซน์ให้ขลังเหมือนหน้าบัตรเครดิต */}
      <div className="bg-zinc-900 p-8 sm:p-10 rounded-[3rem] text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden active:scale-[0.98] transition-all group">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-4 text-orange-400">
            End of Day Revenue
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-500 italic">
              ฿
            </span>
            <h3 className="text-6xl sm:text-7xl font-black italic tracking-tighter tabular-nums">
              {(report?.totalRevenue ?? 0).toLocaleString()}
            </h3>
          </div>
          <div className="mt-8 flex items-center gap-2 opacity-50">
            <ArrowDownToLine size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              ยอดเงินโอนเข้าบัญชีเรียบร้อย
            </span>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] uppercase font-black text-[12rem] -rotate-12 select-none group-hover:rotate-0 transition-transform duration-1000">
          EOD
        </div>
      </div>

      {/* 💳 Payment Breakdown - ปรับให้ Card ดูสะอาดตาขึ้น */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-zinc-50 shadow-sm flex flex-col items-center transition-all hover:border-orange-100">
          <div className="w-14 h-14 bg-green-50 rounded-[1.5rem] flex items-center justify-center mb-4">
            <Banknote className="text-green-500" size={32} />
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
            เงินสด
          </p>
          <p className="text-2xl font-black text-zinc-900 tabular-nums">
            ฿{(report?.cashTotal ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-zinc-50 shadow-sm flex flex-col items-center transition-all hover:border-orange-100">
          <div className="w-14 h-14 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-4">
            <CreditCard className="text-blue-500" size={32} />
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
            เงินโอน
          </p>
          <p className="text-2xl font-black text-zinc-900 tabular-nums">
            ฿{(report?.transferTotal ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 📊 Order Statistics - ปรับความหรูหราของ List */}
      <div className="bg-white rounded-[3rem] p-8 sm:p-10 border border-zinc-100 shadow-sm space-y-8">
        <div className="flex justify-between items-center border-b border-zinc-50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-400">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="font-black text-zinc-900 text-sm italic">
                Success Orders
              </p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                บิลที่ชำระเงินสำเร็จ
              </p>
            </div>
          </div>
          <span className="font-black text-2xl text-zinc-900 tabular-nums">
            {report?.totalOrders}{" "}
            <span className="text-xs text-zinc-300">Bills</span>
          </span>
        </div>

        {/* ✅ VOID Section: ปรับให้ดูเป็นการแจ้งเตือนที่ชัดเจน */}
        <div className="flex justify-between items-center bg-red-50/50 p-6 rounded-[2rem] border border-red-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-200">
              <XCircle size={24} />
            </div>
            <div>
              <p className="font-black text-red-600 text-sm italic tracking-tight">
                Voided Items
              </p>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
                รายการที่ยกเลิก
              </p>
            </div>
          </div>
          <span className="font-black text-2xl text-red-500 tabular-nums">
            {report?.voidOrders}{" "}
            <span className="text-xs text-red-300">Items</span>
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <p className="text-center text-zinc-300 font-bold text-[9px] uppercase tracking-[0.3em] mt-4 px-10 leading-relaxed">
        ข้อมูลถูกอัปเดตแบบ Real-time ตามฐานข้อมูลล่าสุดของระบบจัดการร้าน
      </p>
    </div>
  );
};

export default DailyReportPage;
