import "./styles/print.css";

const KitchenSlip = ({ data }) => {
  const items = data?.items || data?.cartItems || [];
  const tableNum = data?.tableNumber || "-";

  return (
    <div className="kitchen-slip-wrapper">
      <div className="w-full text-black antialiased">
        {/* ส่วนหัว: เลขโต๊ะ */}
        <div className="text-center border-b-2 border-black pb-2 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 m-0">
            Table / โต๊ะ
          </p>
          <div className="text-4xl font-black leading-none">{tableNum}</div>
        </div>

        {/* รายการอาหาร */}
        <div className="divide-y divide-zinc-200">
          {items.map((item, index) => {
            const opt = item.options || {};
            const displayName = item.menuName || item.name || "รายการอาหาร";

            return (
              <div key={index} className="py-2">
                <div className="flex gap-2 items-start">
                  {/* จำนวน: ใส่ style กันเหนียวเรื่องสีพื้นหลังหลุด */}
                  <div
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      WebkitPrintColorAdjust: "exact",
                    }}
                    className="text-lg font-black w-7 h-7 flex items-center justify-center rounded shrink-0 mt-0.5"
                  >
                    {item.quantity}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-black text-zinc-900 leading-tight">
                      {displayName}
                    </div>

                    {/* รายละเอียด Options */}
                    {(opt.size || opt.noodle || opt.format) && (
                      <div className="text-[13px] text-zinc-500 font-bold mt-0.5 italic">
                        {opt.size && <span>[{opt.size}]</span>}
                        {opt.noodle && <span> • {opt.noodle}</span>}
                        {opt.format && <span> • {opt.format}</span>}
                      </div>
                    )}

                    {/* ส่วนที่เพิ่ม (Ingredients) */}
                    {opt.ingredients && opt.ingredients.length > 0 && (
                      <div className="text-[12px] text-zinc-700 font-bold mt-1 px-1.5 py-0.5 bg-zinc-100 border-l-2 border-zinc-400">
                        + {opt.ingredients.join(", ")}
                      </div>
                    )}

                    {/* ส่วนที่ห้ามใส่ (Excluded) */}
                    {opt.excluded && opt.excluded.length > 0 && (
                      <div className="text-[12px] text-red-600 font-black mt-1 px-1.5 py-0.5 bg-red-50 border border-red-200 rounded">
                        ** ไม่ใส่: {opt.excluded.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ส่วนท้าย: เวลา */}
        <div className="mt-4 pt-2 border-t border-black border-dashed flex justify-between items-center text-zinc-400 font-bold">
          <div className="text-[9px] uppercase tracking-tighter">
            Kitchen Order
          </div>
          <div className="text-[11px]">
            {new Date().toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            น.
          </div>
        </div>

        {/* Padding ท้ายใบสำหรับระยะตัดกระดาษ */}
        <div className="h-10 no-print"></div>
      </div>
    </div>
  );
};

export default KitchenSlip;
