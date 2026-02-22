import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Check } from "lucide-react";
import KitchenSlip from "../../KitchenSlip";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      console.log("Print Success");
    },
  });

  if (!isOpen) return null;

  return (
    <>
      {/* 1. ส่วนสำหรับพิมพ์: แยกออกมานอก Modal และใช้เทคนิคซ่อนแบบ "มีตัวตน" */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "0",
          width: "58mm", // ระบุขนาดที่แน่นอน
          zIndex: -1,
        }}
      >
        <div ref={componentRef} className="bg-white p-2">
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
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                // ✅ เรียกพิมพ์ตรงๆ
                handlePrint();
              }}
              className="w-full py-5 rounded-[1.75rem] font-black text-lg bg-zinc-900 text-white shadow-xl active:scale-95"
            >
              พิมพ์ใบสั่งครัว
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
    </>
  );
};

export default KitchenModal;
