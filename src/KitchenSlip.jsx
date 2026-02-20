// KitchenSlip.jsx

const KitchenSlip = ({ data }) => {
  const items = data?.items || data?.cartItems || [];

  return (
    <div className="w-[80mm] p-4 bg-white text-black font-sans leading-tight">
      {/* Header: เลขโต๊ะ */}
      <div className="text-center border-b-4 border-black pb-2 mb-3">
        <div className="text-3xl font-black text-center uppercase tracking-tighter">
          โต๊ะ {data?.tableNumber || "-"}
        </div>
      </div>

      <div className="divide-y-2 divide-gray-100">
        {items.map((item, index) => {
          const opt = item.options || {};
          const displayName = item.menuName || item.name || "รายการอาหาร";

          return (
            <div key={index} className="flex gap-4 items-start py-3">
              {/* จำนวนตัวใหญ่ๆ */}
              <div className="text-2xl font-black min-w-[35px] text-zinc-900">
                {item.quantity}
              </div>

              <div className="flex-1">
                {/* 🎯 ชื่อเมนู */}
                <div className="text-2xl font-black text-zinc-900 leading-none">
                  {displayName}
                </div>

                {/* รายละเอียด เส้น และ ขนาด */}
                <div className="flex flex-wrap gap-x-2 text-lg text-zinc-500 font-bold italic mt-1">
                  {opt.size && <span>ไซส์ {opt.size}</span>}
                  {opt.noodle && <span>• {opt.noodle}</span>}
                  {opt.format && <span>• {opt.format}</span>}
                </div>

                {/* ✅ 1. แสดงส่วนผสมที่ "เลือกใส่" (Ingredients) */}
                {opt.ingredients && opt.ingredients.length > 0 && (
                  <div className="text-lg text-zinc-700 font-bold mt-1 bg-zinc-50 p-1 rounded">
                    + ใส่: {opt.ingredients.join(", ")}
                  </div>
                )}

                {/* ✅ 2. แสดงส่วนผสมที่ "ไม่ใส่" (Excluded) */}
                {opt.excluded && opt.excluded.length > 0 && (
                  <div className="text-xl text-red-600 font-black mt-2 bg-red-50 p-1 rounded-lg">
                    ** ไม่ใส่: {opt.excluded.join(", ")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-2 border-t border-dashed border-gray-300 text-center text-[10px] text-gray-400 font-bold">
        {new Date().toLocaleTimeString("th-TH")} น.
      </div>
    </div>
  );
};

export default KitchenSlip;
