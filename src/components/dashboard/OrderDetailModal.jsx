import { X, ReceiptText } from "lucide-react";

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const billDisplay = order.billNumber || order.id;
  const tableDisplay = order.tableNumber || "N/A";
  const itemsList = order.items || [];
  const timeDisplay = new Date(order.updatedAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    // ปรับ items-end บนมือถือเพื่อให้ Modal ติดขอบล่าง / items-center บนจอปกติ
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      {/* ปรับ slide-in-from-bottom สำหรับมือถือ และ zoom-in สำหรับจอใหญ่ */}
      <div className="bg-white w-full sm:max-w-sm rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
        {/* Header - ปรับ Padding เล็กน้อย */}
        <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <ReceiptText size={20} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base sm:text-lg">
                บิล #{billDisplay}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {timeDisplay} น. • โต๊ะ {tableDisplay}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* รายการอาหาร - ปรับความสูงให้เหมาะสมกับหน้าจอมือถือ (Viewport Height) */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
          {itemsList.length === 0 ? (
            <p className="text-center text-gray-300 font-bold py-4">
              ไม่มีรายการอาหาร
            </p>
          ) : (
            itemsList.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-start gap-4 border-b border-gray-50 pb-3 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">
                    {item.menuName}{" "}
                    <span className="text-orange-500">x{item.quantity}</span>
                  </p>
                  {item.options?.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium italic mt-0.5">
                      {item.options.join(" • ")}
                    </p>
                  )}
                </div>
                <p className="font-black text-gray-900 text-sm sm:text-base">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer สรุปยอด - ปรับขนาดตัวเลขให้เด่นชัดบนมือถือ */}
        <div className="p-6 sm:p-8 bg-zinc-900 text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              การชำระเงิน
            </span>
            <span className="bg-zinc-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-orange-400">
              {order.paymentMethod || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-bold">ยอดรวมสุทธิ</span>
            <span className="text-2xl sm:text-3xl font-black text-orange-500 font-mono">
              ฿{Number(order.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
