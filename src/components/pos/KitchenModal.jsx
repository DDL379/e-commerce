import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import KitchenSlip from "../../KitchenSlip";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  if (!isOpen) return null;

  const isReady = orderData && (orderData.items || orderData.cartItems);

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-900/60 backdrop-blur-md">
      <div className="bg-white rounded-t-[3.5rem] sm:rounded-[3rem] p-8 w-full sm:max-w-sm shadow-2xl">
        {/* UI ส่วนบนคงเดิม */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black">สั่งอาหารสำเร็จ!</h3>
        </div>

        {/* ✅ จุดสำคัญ: ห้ามใช้ display: none ให้ใช้ opacity-0 และ height-0 */}
        {/* และต้องมั่นใจว่า div นี้อยู่ใน DOM เสมอเมื่อ Modal เปิด */}
        <div
          style={{
            height: "0px",
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <div ref={componentRef}>
            <KitchenSlip key={orderData?.id || "slip"} data={orderData} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            disabled={!isReady}
            onClick={() => {
              // ✅ ตรวจสอบก่อนว่า Ref มีค่าไหม (เพื่อ Debug)
              if (componentRef.current) {
                handlePrint();
              } else {
                console.error("ComponentRef ยังเป็น null อยู่!");
              }
            }}
            className={`w-full py-5 rounded-[1.75rem] font-black text-lg ${
              !isReady ? "bg-zinc-100 text-zinc-300" : "bg-zinc-900 text-white"
            }`}
          >
            {isReady ? "พิมพ์ใบสั่งครัว" : "กำลังโหลดข้อมูล..."}
          </button>

          <button onClick={onClose} className="w-full py-4 text-zinc-400">
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenModal;
