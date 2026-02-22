import { useNavigate } from "react-router"; // หรือ "react-router" ตามที่ใช้ใน AppRouter
import { Check } from "lucide-react";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isReady = orderData && (orderData.items || orderData.cartItems);

  const handleGoToPrint = () => {
    if (!isReady) return;

    // ✅ 1. บันทึกข้อมูลลง localStorage
    localStorage.setItem("print_order_data", JSON.stringify(orderData));

    // ✅ 2. เปิดหน้าใหม่
    window.open("/print-order", "_blank");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-900/60 backdrop-blur-md">
      <div className="bg-white rounded-t-[3.5rem] sm:rounded-[3rem] p-8 w-full sm:max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="text-green-600" size={30} strokeWidth={4} />
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-zinc-900">
            สั่งอาหารสำเร็จ!
          </h3>
          <p className="text-zinc-500 text-sm font-bold mt-1">
            รายการถูกส่งเข้าครัวแล้ว
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            disabled={!isReady}
            onClick={handleGoToPrint}
            className={`w-full py-5 rounded-[1.75rem] font-black text-lg transition-all active:scale-95 shadow-xl ${
              !isReady
                ? "bg-zinc-100 text-zinc-300"
                : "bg-zinc-900 text-white shadow-zinc-200"
            }`}
          >
            {isReady ? "พิมพ์ใบสั่งครัว" : "กำลังโหลดข้อมูล..."}
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 text-zinc-400 font-bold uppercase text-xs tracking-widest"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenModal;
