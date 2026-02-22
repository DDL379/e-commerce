import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Check } from "lucide-react";
import KitchenSlip from "../../KitchenSlip";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Order-Table-${orderData?.tableNumber || "N-A"}`,
  });

  if (!isOpen) return null;

  const isReady = orderData && (orderData.items || orderData.cartItems);

  return (
    <>
      {/* 1. ส่วนสำหรับพิมพ์ (อยู่นอก Modal เพื่อไม่ให้ Mobile Browser สับสน) */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0",
          height: "0",
          overflow: "hidden",
        }}
      >
        <div ref={componentRef} className="bg-white p-2">
          {/* ใส่ key เพื่อบังคับให้อัปเดตข้อมูลล่าสุดเสมอ */}
          <KitchenSlip key={orderData?.id || Date.now()} data={orderData} />
        </div>
      </div>

      {/* 2. ส่วน Modal ที่โชว์บนหน้าจอ */}
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
              ส่งรายการเข้าครัวแล้ว
            </p>
          </div>

          {/* แสดงตัวอย่างให้เห็นในเครื่องเราเองเฉยๆ แต่ไม่ต้องใช้ Ref ตรงนี้ */}
          <div className="mb-6 border-2 border-dashed border-zinc-200 rounded-2xl p-2 bg-zinc-50 overflow-hidden">
            <div className="max-h-[120px] overflow-y-auto scrollbar-hide rounded-xl opacity-60">
              <KitchenSlip data={orderData} />
            </div>
            <p className="text-center text-[10px] text-zinc-400 font-bold mt-2">
              --- พิมพ์ใบสั่งครัวด้านล่าง ---
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              disabled={!isReady}
              onClick={() => handlePrint()}
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
    </>
  );
};

export default KitchenModal;
