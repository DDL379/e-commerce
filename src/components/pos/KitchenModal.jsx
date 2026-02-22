import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Check } from "lucide-react";
import KitchenSlip from "../../KitchenSlip";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef(null); // เติม null ไว้เริ่มต้น

  const isReady = orderData && (orderData.items || orderData.cartItems);

  // ✅ ปรับ Syntax ให้รองรับทั้งเวอร์ชั่นเก่าและใหม่
  const handlePrint = useReactToPrint({
    // ถ้าใช้ v2.x ใช้ content: () => componentRef.current
    // ถ้าใช้ v3.x ใช้ contentRef: componentRef
    // เพื่อความชัวร์ เราเขียนแบบนี้ครับ:
    content: () => componentRef.current,
    onBeforePrint: () => console.log("กำลังเตรียมพิมพ์..."),
    onAfterPrint: () => console.log("พิมพ์เสร็จแล้ว"),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-900/60 backdrop-blur-md">
      <div className="bg-white rounded-t-[3.5rem] sm:rounded-[3rem] p-8 w-full sm:max-w-sm shadow-2xl overflow-hidden">
        {/* ส่วน UI เดิมของคุณแบงค์ */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-zinc-900">
            สั่งอาหารสำเร็จ!
          </h3>
        </div>

        {/* ✅ จุดสำคัญ: เปลี่ยนวิธีซ่อนจากการใช้ Absolute ไปไกลๆ เป็นการใช้ Wrapper ที่มีตัวตน */}
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            {/* ใส่ Key เพื่อให้ข้อมูล Refresh เสมอ */}
            <KitchenSlip key={orderData?.id || Date.now()} data={orderData} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            disabled={!isReady}
            onClick={() => handlePrint()} // ✅ ใส่ arrow function ครอบไว้
            className={`w-full py-5 rounded-[1.75rem] font-black text-lg ${
              !isReady ? "bg-zinc-100 text-zinc-300" : "bg-zinc-900 text-white"
            }`}
          >
            {isReady ? "พิมพ์ใบสั่งครัว" : "กำลังโหลดข้อมูล..."}
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 text-zinc-400 font-bold"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
export default KitchenModal;
