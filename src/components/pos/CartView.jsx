import { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import useCartStore from "../../store/useCartStore";
import { addOrderItems } from "../../api/axios";

const CartView = ({ isOpen, onClose, orderId, tableId, onSuccess }) => {
  // ✅ อย่าลืมดึงฟังก์ชันเพิ่มลงตะกร้ามาด้วย (ในที่นี้สมมติชื่อ addToCart)
  const { cart, updateQuantity, removeFromCart, clearCart, addToCart } =
    useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // ✅ ฟังก์ชันสำหรับกดเพิ่ม "บัตรส่วนลด" (-60 บาท)
  const handleAddDiscount = () => {
    const existingIndex = cart.findIndex((item) => item.options?.isDiscount);

    if (existingIndex !== -1) {
      // ถ้ามีบัตรส่วนลดอยู่แล้ว ให้บวกจำนวนขึ้น 1
      updateQuantity(existingIndex, cart[existingIndex].quantity + 1);
    } else {
      // ถ้ายังไม่มี ให้สร้างไอเทมจำลองราคาติดลบ
      addToCart({
        id: "discount-card",
        name: "🎟️ บัตรส่วนลด",
        price: -60,
        quantity: 1,
        options: {
          isDiscount: true,
          totalPrice: -60,
        },
      });
    }
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    const safeOrderId = Number(orderId);

    try {
      setIsSubmitting(true);
      const itemsToProcess = cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.options?.totalPrice ?? item.price,
        options: {
          ...item.options, // จะส่ง extraAddons, note, isDiscount ไปให้อัตโนมัติ
          excluded: item.options?.excluded || [],
        },
      }));

      const orderData = {
        orderId: safeOrderId,
        cartItems: itemsToProcess,
      };

      const res = await addOrderItems(orderData);
      const finalData = res.data?.data || res.data;

      const dataForModal = {
        ...finalData,
        items: itemsToProcess,
        tableNumber: finalData.tableNumber || tableId || "???",
      };

      clearCart();
      onClose();
      if (onSuccess) onSuccess(dataForModal);
    } catch (error) {
      console.error("🔥 Error:", error);
      alert("สั่งอาหารไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-all p-0 sm:p-4 text-zinc-900">
      <div className="bg-white w-full sm:max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 italic">
              รายการในตะกร้า
            </h3>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              โต๊ะ {tableId} • ทั้งหมด {cart.length} รายการ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-gray-50 rounded-2xl text-gray-400 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Order List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-300 font-bold uppercase tracking-widest text-sm">
              ไม่มีรายการในตะกร้า
            </div>
          ) : (
            cart.map((item, index) => {
              const itemPrice = item.options?.totalPrice || item.price;
              const isDiscount = item.options?.isDiscount;

              return (
                <div
                  key={index}
                  className={`p-4 sm:p-5 rounded-[2rem] flex flex-col gap-3 transition-all shadow-sm border ${
                    isDiscount
                      ? "bg-orange-50/50 border-orange-100"
                      : "bg-gray-50 border-transparent hover:border-orange-100"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-black text-base sm:text-lg leading-tight truncate ${isDiscount ? "text-orange-600" : "text-gray-800"}`}
                      >
                        {item.name}
                      </h4>

                      {/* ✅ แสดงรายละเอียดอาหาร (ซ่อนถ้าเป็นบัตรส่วนลด) */}
                      {!isDiscount && (
                        <div className="mt-1.5 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black bg-zinc-900 text-white px-2 py-0.5 rounded-md uppercase">
                              {item.options?.size || "S"}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 italic">
                              {item.options?.noodle} • {item.options?.format}
                            </span>
                          </div>

                          {/* สิ่งที่ไม่ใส่ (Excluded) */}
                          {item.options?.excluded?.length > 0 && (
                            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg w-fit border border-red-100">
                              <AlertCircle size={10} />
                              ไม่ใส่: {item.options.excluded.join(", ")}
                            </div>
                          )}

                          {/* ✅ ท็อปปิ้ง (Extra Addons) */}
                          {item.options?.extraAddons?.length > 0 && (
                            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit border border-blue-100">
                              <Plus size={10} strokeWidth={3} />
                              {item.options.extraAddons.join(", ")}
                            </div>
                          )}

                          {/* ✅ หมายเหตุ (Note) */}
                          {item.options?.note && (
                            <div className="flex items-start gap-1 text-[10px] sm:text-[11px] font-bold text-zinc-700 bg-zinc-200/60 px-2 py-1.5 rounded-lg w-fit border border-zinc-200">
                              📝 {item.options.note}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ราคา */}
                    <p
                      className={`font-black text-base sm:text-lg whitespace-nowrap ${isDiscount ? "text-orange-600" : "text-zinc-900"}`}
                    >
                      {isDiscount ? "" : "฿"}
                      {(itemPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-3 sm:gap-4 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-sm border border-gray-100">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-orange-600 active:scale-125 transition-all"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-black text-sm sm:text-base w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-orange-600 active:scale-125 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-2 text-gray-300 hover:text-red-500 active:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 rounded-b-[0] sm:rounded-b-[3rem] pb-8 sm:pb-8 flex flex-col gap-4">
          {/* ✅ ส่วนควบคุมบัตรส่วนลด */}
          {cart.length > 0 && (
            <div className="flex justify-start">
              <button
                onClick={handleAddDiscount}
                className="flex items-center gap-1.5 text-[11px] font-black text-orange-600 bg-orange-100/50 hover:bg-orange-100 px-3 py-2 rounded-xl transition-all active:scale-95 border border-orange-200"
              >
                <Plus size={14} strokeWidth={3} /> เพิ่มบัตรส่วนลด (-60฿)
              </button>
            </div>
          )}

          {/* สรุปยอดรวม */}
          <div className="flex justify-between items-end px-2">
            <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-1">
              ยอดรวมทั้งสิ้น
            </span>
            <span className="text-4xl sm:text-5xl font-[1000] text-orange-600 tracking-tighter">
              ฿
              {cart
                .reduce(
                  (total, item) =>
                    total +
                    (item.options?.totalPrice || item.price) * item.quantity,
                  0,
                )
                .toLocaleString()}
            </span>
          </div>

          {/* ปุ่ม Action */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              onClick={clearCart}
              disabled={isSubmitting}
              className="py-4 font-bold text-gray-400 hover:bg-white rounded-2xl transition-all uppercase text-[10px] tracking-widest active:scale-95"
            >
              ล้างตะกร้า
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting || cart.length === 0}
              className="bg-zinc-900 text-white py-4 rounded-2xl font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-300 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <CreditCard size={20} /> สั่งอาหาร
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
