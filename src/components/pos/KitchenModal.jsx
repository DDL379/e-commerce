import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Check } from "lucide-react";
import KitchenSlip from "../../KitchenSlip";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef();

  const isReady = orderData && (orderData.items || orderData.cartItems);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  if (!isOpen) return null;

  return (
    // ✅ ปรับเป็น items-end บนมือถือ (เด้งขึ้นจากล่าง) / items-center บนจอปกติ
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* ✅ ปรับ rounded-t สำหรับมือถือเพื่อให้ดูทันสมัยเหมือนแอป iOS/Android */}
      <div className="bg-white rounded-t-[3.5rem] sm:rounded-[3rem] p-8 sm:p-10 w-full sm:max-w-sm shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-500 overflow-hidden">
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-green-100 p-4 sm:p-5 rounded-full ring-4 sm:ring-8 ring-green-50 animate-bounce duration-700">
            <Check
              size={36}
              className="text-green-600 sm:w-10 sm:h-10"
              strokeWidth={4}
            />
          </div>
        </div>

        <div className="text-center mb-8 sm:mb-10">
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight">
            สั่งอาหารสำเร็จ!
          </h3>
          <p className="text-zinc-400 font-bold mt-2 uppercase text-[10px] sm:text-[11px] tracking-widest">
            Order sent to kitchen
          </p>
        </div>

        {/* ✅ ซ่อน Slip ไว้สำหรับการพิมพ์ (ซ่อนไว้ให้ไกลสายตา) */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <div ref={componentRef}>
            <KitchenSlip data={orderData} />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 pb-6 sm:pb-0">
          <button
            disabled={!isReady}
            onClick={handlePrint}
            // ✅ ปรับสีให้เป็นสีเขียว (Success) หรือส้มตามแบรนด์คุณแบงค์ เพื่อสื่อถึงการทำสำเร็จ
            className={`w-full py-5 rounded-[1.75rem] font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
              !isReady
                ? "bg-zinc-100 text-zinc-300"
                : "bg-zinc-900 text-white shadow-zinc-200"
            }`}
          >
            {isReady ? "พิมพ์ใบสั่งครัว" : "กำลังโหลดข้อมูล..."}
          </button>

          <button
            onClick={onClose}
            className="w-full bg-zinc-50 text-zinc-400 py-4 sm:py-5 rounded-[1.75rem] font-black text-sm uppercase tracking-widest transition-colors hover:bg-zinc-100"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenModal;
