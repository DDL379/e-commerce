import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Check } from "lucide-react";
import KitchenSlip from "../../KitchenSlip";

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef(null);

  // ✅ การเขียนแบบ v3.x (ห้ามใส่ .then() ต่อท้ายใน onClick)
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // ใช้ contentRef แทน content
    documentTitle: `Order-${orderData?.tableNumber || "Slip"}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] ...">
      {/* ... UI เดิมของคุณแบงค์ ... */}

      {/* ✅ ส่วนที่ซ่อนไว้สำหรับพิมพ์ */}
      <div style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div ref={componentRef}>
          <KitchenSlip key={orderData?.id} data={orderData} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            // ✅ เรียกฟังก์ชันตรงๆ ห้ามต่อด้วย .then()
            // เพราะ handlePrint ใน v3 ไม่ได้คืนค่าเป็น Promise
            handlePrint();
          }}
          className="..."
        >
          พิมพ์ใบสั่งครัว
        </button>
        {/* ... */}
      </div>
    </div>
  );
};
export default KitchenModal;
