const KitchenSlip = ({ data }) => {
  const items = data?.items || data?.cartItems || [];
  const tableNum = data?.tableNumber || "-";

  return (
    <div className="w-full max-w-[80mm] mx-auto p-4 bg-white text-black font-sans antialiased">
      {/* ส่วนหัว: เลขโต๊ะต้องใหญ่และเด่นที่สุด */}
      <div className="text-center border-b-[6px] border-black pb-4 mb-4">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
          Table / โต๊ะ
        </p>
        <div className="text-6xl font-[1000] text-center uppercase tracking-tighter leading-none">
          {tableNum}
        </div>
      </div>

      {/* รายการอาหาร */}
      <div className="space-y-1">
        {items.map((item, index) => {
          const opt = item.options || {};
          const displayName = item.menuName || item.name || "รายการอาหาร";

          return (
            <div
              key={index}
              className="border-b-2 border-zinc-100 last:border-0 py-4"
            >
              <div className="flex gap-4 items-start">
                {/* จำนวน: วงกลมดำตัวหนังสือขาว ให้เห็นชัดๆ */}
                <div className="bg-black text-white text-3xl font-black w-12 h-12 flex items-center justify-center rounded-lg shrink-0">
                  {item.quantity}
                </div>

                <div className="flex-1 min-w-0">
                  {/* ชื่อเมนู */}
                  <div className="text-3xl font-[1000] text-zinc-900 leading-tight break-words">
                    {displayName}
                  </div>

                  {/* ตัวเลือกพื้นฐาน (ไซส์, เส้น) */}
                  {(opt.size || opt.noodle || opt.format) && (
                    <div className="flex flex-wrap gap-x-2 text-xl text-zinc-600 font-extrabold mt-1 uppercase italic">
                      {opt.size && <span>[{opt.size}]</span>}
                      {opt.noodle && <span>• {opt.noodle}</span>}
                      {opt.format && <span>• {opt.format}</span>}
                    </div>
                  )}

                  {/* ส่วนที่เพิ่ม (Ingredients) */}
                  {opt.ingredients && opt.ingredients.length > 0 && (
                    <div className="text-xl text-zinc-800 font-bold mt-2 py-1 px-2 bg-zinc-100 rounded border-l-4 border-zinc-400">
                      เพิ่ม: {opt.ingredients.join(", ")}
                    </div>
                  )}

                  {/* ส่วนที่ห้ามใส่ (Excluded) - ตัวหนาและใหญ่พิเศษเพื่อป้องกันการทำผิด */}
                  {opt.excluded && opt.excluded.length > 0 && (
                    <div className="text-2xl text-red-600 font-[1000] mt-3 py-2 px-2 bg-red-50 rounded-xl border-2 border-red-600 animate-pulse">
                      !!! ไม่ใส่: {opt.excluded.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ส่วนท้าย: เวลาและคำขอบคุณ */}
      <div className="mt-8 pt-4 border-t-4 border-black border-double flex justify-between items-center text-zinc-500 font-black italic">
        <div className="text-sm uppercase tracking-widest">Kitchen Order</div>
        <div className="text-lg">
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
