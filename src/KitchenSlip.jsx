import "./styles/print.css";

const KitchenSlip = ({ data }) => {
  const items = data?.items || data?.cartItems || [];
  const tableNum = data?.tableNumber || "-";

  return (
    <div className="kitchen-slip-wrapper">
      <div className="w-full text-black antialiased">
        {/* ส่วนหัว: เลขโต๊ะ (ขยายใหญ่ขึ้น) */}
        <div className="text-center border-b-4 border-black pb-2 mb-2">
          <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 m-0">
            Table / โต๊ะ
          </p>
          <div className="text-6xl font-[1000] leading-none py-1">
            {tableNum}
          </div>
        </div>

        {/* รายการอาหาร */}
        <div className="divide-y-2 divide-zinc-200">
          {items.map((item, index) => {
            const opt = item.options || {};
            const displayName = item.menuName || item.name || "รายการอาหาร";

            return (
              <div key={index} className="py-3">
                <div className="flex gap-3 items-start">
                  {/* จำนวน: ใหญ่ขึ้นและเด่นมาก */}
                  <div
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                    }}
                    className="text-2xl font-black min-w-[36px] h-[36px] flex items-center justify-center rounded-md shrink-0 mt-0.5"
                  >
                    {item.quantity}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* ชื่อเมนู: ขยายเป็น text-2xl */}
                    <div className="text-2xl font-[1000] text-zinc-900 leading-tight break-words">
                      {displayName}
                    </div>

                    {/* รายละเอียด Options: ขยายขนาดอ่านง่ายขึ้น */}
                    {(opt.size || opt.noodle || opt.format) && (
                      <div className="text-lg text-zinc-600 font-extrabold mt-1 italic leading-tight">
                        {opt.size && <span>[{opt.size}]</span>}
                        {opt.noodle && <span> • {opt.noodle}</span>}
                        {opt.format && <span> • {opt.format}</span>}
                      </div>
                    )}

                    {/* ส่วนที่เพิ่ม (Ingredients): ตัวใหญ่และหนาขึ้น */}
                    {opt.ingredients && opt.ingredients.length > 0 && (
                      <div className="text-lg text-zinc-800 font-black mt-2 px-2 py-1 bg-zinc-100 border-l-4 border-zinc-400">
                        + {opt.ingredients.join(", ")}
                      </div>
                    )}

                    {/* ส่วนที่ห้ามใส่ (Excluded): ใหญ่และแดงชัดเจนป้องกันทำผิด */}
                    {opt.excluded && opt.excluded.length > 0 && (
                      <div className="text-xl text-red-600 font-[1000] mt-2 px-2 py-1 bg-red-50 border-2 border-red-600 rounded-lg">
                        ** ไม่ใส่: {opt.excluded.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ส่วนท้าย: ปรับให้หนาขึ้น */}
        <div className="mt-6 pt-2 border-t-2 border-black border-dashed flex justify-between items-center text-zinc-500 font-black">
          <div className="text-xs uppercase tracking-tighter">
            Kitchen Order
          </div>
          <div className="text-lg">
            {new Date().toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            น.
          </div>
        </div>

        {/* ระยะเผื่อตัดกระดาษ */}
        <div className="h-12 no-print"></div>
      </div>
    </div>
  );
};

export default KitchenSlip;
