import { X, Printer, CheckCircle2 } from "lucide-react";

const ReceiptModal = ({ isOpen, orderData, onClose }) => {
  if (!isOpen || !orderData) return null;

  return (
    // ✅ items-end บนมือถือ (เด้งจากล่าง) / items-center บนจอปกติ
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* ✅ ปรับมุมโค้งมนเฉพาะด้านบนสำหรับมือถือ เพื่อให้ความรู้สึกเหมือน Slip ที่ออกมาจากเครื่อง */}
      <div className="bg-white w-full sm:max-w-sm rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-hidden max-h-[95vh] sm:max-h-[85vh]">
        {/* Header: แสดงความสำเร็จ - ปรับสีให้ดู Professional */}
        <div className="bg-zinc-900 p-8 sm:p-10 text-center text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors p-2 active:scale-90"
          >
            <X size={24} className="sm:w-5 sm:h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 shadow-xl shadow-green-500/20 animate-in zoom-in duration-500 delay-100">
            <CheckCircle2 size={36} />
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight italic">
            ชำระเงินสำเร็จ
          </h3>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Bill ID: {orderData.billNumber || orderData.id}
          </p>
        </div>

        {/* Receipt Body: รายการอาหาร - ปรับ Scroll ให้พอดีกับจอ */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-4 border-b border-dashed border-zinc-200 pb-6">
            {orderData.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start text-sm"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-zinc-400 text-[10px] shrink-0">
                      {item.quantity}x
                    </span>
                    <span className="font-bold text-zinc-900 truncate">
                      {item.menuName}
                    </span>
                  </div>
                  {item.options?.length > 0 && (
                    <p className="text-[10px] text-zinc-400 ml-7 mt-1 leading-relaxed">
                      {item.options.join(" • ")}
                    </p>
                  )}
                </div>
                <span className="font-black text-zinc-900 whitespace-nowrap">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* สรุปยอดเงิน - เน้นตัวใหญ่เห็นชัด */}
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>ยอดรวมรายการ</span>
              <span>฿{orderData.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
              <span className="text-sm font-black text-zinc-900 uppercase italic">
                ยอดสุทธิ
              </span>
              <span className="text-3xl font-black text-orange-600 tabular-nums">
                ฿{orderData.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer: ปุ่มกด - ปรับให้กดง่ายบนพื้นที่ล่างจอ */}
        <div className="p-6 sm:p-8 pt-0 grid grid-cols-1 gap-3 pb-10 sm:pb-8 shrink-0">
          <button
            onClick={() => window.print()}
            className="w-full bg-zinc-50 text-zinc-900 py-4.5 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all active:scale-95 border border-zinc-100"
          >
            <Printer size={18} /> พิมพ์ใบเสร็จ
          </button>
          <button
            onClick={onClose}
            className="w-full bg-zinc-900 text-white py-5 rounded-[1.25rem] font-black text-base shadow-xl shadow-zinc-200 transition-all active:scale-95"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
