import { Plus } from "lucide-react";

const ProductListItem = ({ product, onClick }) => {
  return (
    <button
      onClick={() => onClick(product)}
      // ✅ ปรับความโค้งเป็น rounded-[2rem] ให้รับกับ Modal และเพิ่ม Padding เล็กน้อย
      className="w-full bg-white p-3 sm:p-4 rounded-[2rem] border border-gray-100 flex items-center gap-3 sm:gap-4 active:scale-[0.97] transition-all shadow-sm hover:shadow-md group"
    >
      {/* Icon Area - ปรับขนาดให้เล็กลงนิดหน่อยบนมือถือเพื่อเพิ่มพื้นที่ให้ชื่อเมนู */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-50 rounded-[1.25rem] flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform shrink-0">
        {product.category === "เครื่องดื่ม"
          ? "🥤"
          : product.category === "ของกินเล่น"
            ? "🥟"
            : "🍜"}
      </div>

      {/* Info Area - ใช้ min-w-0 เพื่อให้ truncate ทำงานได้ */}
      <div className="flex-1 text-left min-w-0">
        <h4 className="font-black text-zinc-900 text-sm sm:text-base truncate leading-tight">
          {product.name}
        </h4>
        <p className="text-orange-600 font-black text-sm sm:text-base mt-0.5">
          ฿{Number(product.price).toLocaleString()}
        </p>
      </div>

      {/* Add Button - ปรับให้ดูเป็นปุ่มกดที่ชัดเจนขึ้น */}
      <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-600 rounded-2xl group-active:bg-orange-500 group-active:text-white transition-colors shrink-0">
        <Plus size={20} strokeWidth={3} />
      </div>
    </button>
  );
};

export default ProductListItem;
