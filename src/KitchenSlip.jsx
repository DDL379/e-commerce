const KitchenSlip = ({ data }) => {
  const items = data?.items || data?.cartItems || [];
  const tableNum = data?.tableNumber || "-";

  return (
    <div className="w-full max-w-[80mm] mx-auto p-2 bg-white text-black font-sans antialiased">
      {/* ส่วนหัว: ลดขนาดลงแต่ยังคงความชัดเจน */}
      <div className="text-center border-b-2 border-black pb-2 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Table / โต๊ะ
        </p>
        <div className="text-4xl font-black text-center leading-none">
          {tableNum}
        </div>
      </div>

      {/* รายการอาหาร */}
      <div className="divide-y divide-zinc-200">
        {items.map((item, index) => {
          const opt = item.options || {};
          const displayName = item.menuName || item.name || "รายการอาหาร";

          return (
            <div key={index} className="py-2">
              <div className="flex gap-2 items-start">
                {/* จำนวน: ปรับขนาดให้พอดี ไม่ใหญ่จนเกินไป */}
                <div className="bg-black text-white text-lg font-black w-8 h-8 flex items-center justify-center rounded shrink-0 mt-0.5">
                  {item.quantity}
                </div>

                <div className="flex-1 min-w-0">
                  {/* ชื่อเมนู: ปรับขนาดเป็น text-xl (ประมาณ 20px) กำลังสวยสำหรับการอ่าน */}
                  <div className="text-xl font-black text-zinc-900 leading-tight break-words">
                    {displayName}
                  </div>

                  {/* ตัวเลือกพื้นฐาน: ปรับให้เล็กลงแต่ยังหนาอยู่เพื่อให้แยกจากชื่อเมนู */}
                  {(opt.size || opt.noodle || opt.format) && (
                    <div className="flex flex-wrap gap-x-1 text-sm text-zinc-500 font-bold mt-0.5 italic">
                      {opt.size && <span>[{opt.size}]</span>}
                      {opt.noodle && <span>• {opt.noodle}</span>}
                      {opt.format && <span>• {opt.format}</span>}
                    </div>
                  )}

                  {/* ส่วนที่เพิ่ม (Ingredients) */}
                  {opt.ingredients && opt.ingredients.length > 0 && (
                    <div className="text-sm text-zinc-700 font-bold mt-1 px-1.5 py-0.5 bg-zinc-100 rounded border-l-2 border-zinc-400">
                      + {opt.ingredients.join(", ")}
                    </div>
                  )}

                  {/* ส่วนที่ห้ามใส่ (Excluded): ใช้สีแดงช่วย แต่ลดขนาดลงมาให้ไม่บังเมนูอื่น */}
                  {opt.excluded && opt.excluded.length > 0 && (
                    <div className="text-sm text-red-600 font-black mt-1 px-1.5 py-0.5 bg-red-50 rounded border border-red-200">
                      ** ไม่ใส่: {opt.excluded.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ส่วนท้าย: ปรับให้กระทัดรัดที่สุด */}
      <div className="mt-4 pt-2 border-t border-black border-dashed flex justify-between items-center text-zinc-400 font-bold">
        <div className="text-[10px] uppercase">Kitchen Order</div>
        <div className="text-xs">
          {new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          น.
        </div>
      </div>
    </div>
  );
};

export default KitchenSlip;
