import { Plus, Receipt, Timer, Trash2, Printer } from "lucide-react";

const TableCard = ({
  table,
  onNavigate,
  onCheckout,
  onCancelTable,
  onViewOrder,
}) => {
  const isBusy = table.status === "busy";
  const amount = table?.totalAmount ?? 0;

  return (
    <div
      onClick={() => !isBusy && onNavigate(table.id)}
      className={`group relative aspect-square rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all duration-300 overflow-hidden cursor-pointer active:scale-95 ${
        isBusy
          ? "bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200"
          : "bg-white border-gray-100 text-gray-400 hover:border-zinc-900 hover:text-zinc-900"
      }`}
    >
      {/* 🗑️ ปุ่มยกเลิกโต๊ะ */}
      {isBusy && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (
              window.confirm(
                `คุณแน่ใจหรือไม่ว่าต้องการยกเลิกบิลโต๊ะ ${table.id}?`,
              )
            ) {
              onCancelTable(table.id, table.orderId);
            }
          }}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 bg-white/10 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-60 sm:opacity-40 hover:opacity-100 z-20 active:scale-125"
        >
          <Trash2 size={14} className="sm:w-3 sm:h-3" />
        </button>
      )}

      {/* Content Container */}
      <div className="h-full w-full p-4 sm:p-5 flex flex-col items-center justify-center gap-1 sm:gap-1.5">
        <span
          className={`text-3xl sm:text-5xl font-black italic transition-transform duration-300 group-hover:scale-110 ${isBusy ? "text-white" : "text-gray-100 group-hover:text-zinc-900"}`}
        >
          {table.id}
        </span>

        {isBusy ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 w-full px-2">
            <span className="text-sm sm:text-lg font-black text-orange-500 tabular-nums">
              ฿{amount.toLocaleString()}
            </span>

            {/* ชุดปุ่มกด 3 ปุ่ม (เพิ่มปุ่มปริ้นซ้ำตรงกลาง) */}
            <div className="flex gap-1.5 mt-2 sm:mt-3 w-full justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(table.id);
                }}
                className="flex-1 p-2 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors active:scale-110"
              >
                <Plus size={16} strokeWidth={3} />
              </button>

              {/* ✅ ปุ่มดูรายการ / สั่งปริ้นซ้ำ */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewOrder(table);
                }}
                className="flex-1 p-2 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-500/30 active:scale-110"
              >
                <Printer size={16} strokeWidth={3} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckout(table);
                }}
                className="flex-1 p-2 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors active:scale-110"
              >
                <Receipt size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        ) : (
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            Available
          </span>
        )}
      </div>

      {isBusy && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 opacity-60 bg-white/5 px-2 py-0.5 rounded-full">
          <Timer size={10} className="sm:w-3 sm:h-3" />
          <span className="text-[8px] sm:text-[10px] font-black">15m</span>
        </div>
      )}
    </div>
  );
};

export default TableCard;
