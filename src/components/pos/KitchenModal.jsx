import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Check } from "lucide-react";
import KitchenSlip from "../../KitchenSlip";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef(null);

  // ✅ ตั้งค่าการพิมพ์ (เวอร์ชัน v3.x)
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Order-Table-${orderData?.tableNumber || "N-A"}`,
  });

  if (!isOpen) return null;

  const isReady = orderData && (orderData.items || orderData.cartItems);

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
        </div>

        {/* ✅ จุดสำคัญ: แทนที่จะซ่อนจนมืดสนิท เราจะโชว์ใบเสร็จเล็กๆ ไว้ใน Modal เลย 
            วิธีนี้ทำให้ 'ref' ทำงานแม่นยำ 100% ทั้งคอมและมือถือ และผู้ใช้เห็นด้วยว่าข้อมูลล่าสุดถูกต้องไหม */}
        <div className="mb-6 border-2 border-dashed border-zinc-200 rounded-2xl p-2 bg-zinc-50 overflow-hidden">
          <div className="max-h-[180px] overflow-y-auto scrollbar-hide rounded-xl">
            <div ref={componentRef} className="bg-white shadow-sm p-1">
              {/* ใส่ key={orderData?.id} เพื่อบีบให้ข้อมูลใหม่เสมอ */}
              <KitchenSlip
                key={orderData?.id || JSON.stringify(orderData?.items)}
                data={orderData}
              />
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-400 font-bold mt-2">
            --- ตัวอย่างใบสั่งครัว ---
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            disabled={!isReady}
            onClick={() => handlePrint()}
            className={`w-full py-5 rounded-[1.75rem] font-black text-lg transition-all active:scale-95 ${
              !isReady ? "bg-zinc-100 text-zinc-300" : "bg-zinc-900 text-white"
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
