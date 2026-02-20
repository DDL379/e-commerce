import { Plus, Minus, Trash2 } from "lucide-react";

const CartItem = ({ item, index, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="group flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-1.5rem border border-transparent hover:border-orange-100 transition-all active:scale-[0.98]">
      {/* ส่วนข้อมูลสินค้า - flex-1 เพื่อให้กินพื้นที่ที่เหลือ */}
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-zinc-900 text-sm sm:text-base truncate">
          {item.name}
        </h4>

        {/* ✅ จัดการชื่อออปชั่นให้แสดงผลได้ดีขึ้น ไม่ล้นจอ */}
        <p className="text-[10px] sm:text-xs text-orange-500 font-bold leading-tight mt-0.5 line-clamp-1">
          {item.options?.join(" • ") || "ต้นตำรับ"}
        </p>

        <p className="text-sm sm:text-base font-black text-zinc-900 mt-1">
          ฿{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>

      {/* ✅ ส่วนปรับจำนวน - ปรับขนาดปุ่มให้ใหญ่ขึ้นสำหรับนิ้วสัมผัส */}
      <div className="flex items-center gap-1 sm:gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={onDecrease}
          className="p-2 sm:p-1.5 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-600 transition-colors active:bg-orange-100"
        >
          <Minus size={18} className="sm:w-4 sm:h-4" />
        </button>

        <span className="w-6 sm:w-8 text-center font-black text-sm sm:text-base text-zinc-800">
          {item.quantity}
        </span>

        <button
          onClick={onIncrease}
          className="p-2 sm:p-1.5 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-600 transition-colors active:bg-orange-100"
        >
          <Plus size={18} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* ✅ ปุ่มลบ - ปรับให้สีชัดเจนขึ้นบนมือถือ และเว้นระยะห่างให้กดง่าย */}
      <button
        onClick={onRemove}
        className="p-2.5 text-gray-300 hover:text-red-500 active:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={20} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  );
};

export default CartItem;
