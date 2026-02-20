import { Banknote, CreditCard, X } from "lucide-react";

const CheckoutModal = ({ isOpen, table, onClose, onPayment }) => {
  if (!isOpen) return null;

  return (
    // ✅ items-end บนมือถือ (เด้งจากล่าง) / items-center บนจอใหญ่
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* ✅ ปรับ rounded-t-[3rem] สำหรับมือถือ / rounded-[3rem] สำหรับจอใหญ่ */}
      <div className="bg-white w-full sm:max-w-sm rounded-t-[3rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-2xl flex flex-col items-center gap-6 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 relative">
        {/* ✅ เพิ่มปุ่มปิดกากบาทด้านบน (เผื่อพนักงานหาปุ่มยกเลิกด้านล่างไม่เจอ) */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-gray-300 hover:text-gray-500 sm:hidden"
        >
          <X size={20} />
        </button>

        <div className="text-center mt-2 sm:mt-0">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">
            Payment Selection
          </p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">
            โต๊ะ {table?.id}
          </h3>
          <div className="mt-4 bg-red-50 px-6 py-2 rounded-2xl">
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              ยอดชำระสุทธิ
            </p>
            <p className="text-3xl font-black text-red-500 tabular-nums">
              ฿{Number(table?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4 pb-4 sm:pb-0">
          {/* ✅ ปุ่ม CASH: ปรับสีให้สดและกดง่ายขึ้น */}
          <button
            onClick={() => onPayment("CASH")}
            className="w-full bg-[#22C55E] hover:bg-green-600 text-white py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 active:scale-95 transition-all shadow-lg shadow-green-100"
          >
            <Banknote size={28} /> เงินสด
          </button>

          {/* ✅ ปุ่ม TRANSFER: ปรับสีและไอคอนให้เด่น */}
          <button
            onClick={() => onPayment("TRANSFER")}
            className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 active:scale-95 transition-all shadow-lg shadow-blue-100"
          >
            <CreditCard size={28} /> เงินโอน
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-400 py-4 rounded-[1.5rem] font-black text-sm tracking-widest uppercase transition-colors"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
