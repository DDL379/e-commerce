// KitchenModal.jsx

const KitchenModal = ({ isOpen, onClose, orderData }) => {
  const componentRef = useRef(null);

  // สั่งพิมพ์
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // ดึงค่าจาก ref โดยตรง
    removeAfterPrint: true,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] ...">
      <div className="bg-white ...">
        {/* --- ส่วน UI สั่งสำเร็จ --- */}
        <h3 className="text-2xl font-black">สั่งอาหารสำเร็จ!</h3>

        {/* ✅ ปรับตรงนี้: ใช้ความสูง 0 และซ่อนไว้ แทนการใช้ display: none 
            เพราะบางเวอร์ชั่นถ้าใช้ display: none มันจะหา ref ไม่เจอ */}
        <div style={{ height: 0, overflow: "hidden", opacity: 0 }}>
          <div ref={componentRef}>
            {/* ใส่ key เพื่อให้ Re-render ข้อมูลใหม่เสมอ */}
            <KitchenSlip
              key={orderData?.id || "kitchen-slip"}
              data={orderData}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              if (componentRef.current) {
                handlePrint(); // ถ้ามีของค่อยสั่งพิมพ์
              } else {
                console.error("หาเป้าหมายที่จะพิมพ์ไม่เจอ (Ref is null)");
                alert("เกิดข้อผิดพลาด: หาเป้าหมายการพิมพ์ไม่เจอ");
              }
            }}
            className="..."
          >
            พิมพ์ใบสั่งครัว
          </button>

          {/* ...ปุ่มปิด... */}
        </div>
      </div>
    </div>
  );
};
