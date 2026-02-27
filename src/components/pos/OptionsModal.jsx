import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

const OptionsModal = ({ product, isOpen, onClose, onConfirm }) => {
  // --- States ---
  const [selectedSize, setSelectedSize] = useState({
    name: "S",
    extraPrice: 0,
  });
  const [format, setFormat] = useState("น้ำ");
  const [noodle, setNoodle] = useState("เส้นเล็ก");
  const [selectedIngredients, setSelectedIngredients] = useState([
    "ใส่ครบทุกอย่าง",
  ]);
  const [excludedItems, setExcludedItems] = useState([]);

  // ✅ 1. เพิ่ม State สำหรับ ท็อปปิ้ง และ หมายเหตุ
  const [extraAddons, setExtraAddons] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedSize({ name: "S", extraPrice: 0 });
      setFormat("น้ำ");
      setNoodle("เส้นเล็ก");
      setSelectedIngredients(["ใส่ครบทุกอย่าง"]);
      setExcludedItems([]);
      setExtraAddons([]); // เคลียร์ท็อปปิ้ง
      setNote(""); // เคลียร์หมายเหตุ
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  // ✅ 2. คำนวณราคาใหม่: ราคาอาหาร + ไซส์ + (จำนวนท็อปปิ้ง * 10 บาท)
  const addonPrice = extraAddons.length * 10;
  const totalPrice =
    (product?.price || 0) + selectedSize.extraPrice + addonPrice;

  const toggleIngredient = (ing) => {
    if (ing === "ใส่ครบทุกอย่าง") {
      setSelectedIngredients(["ใส่ครบทุกอย่าง"]);
      return;
    }
    let newIngs = selectedIngredients.filter((i) => i !== "ใส่ครบทุกอย่าง");
    if (newIngs.includes(ing)) {
      newIngs = newIngs.filter((i) => i !== ing);
    } else {
      newIngs.push(ing);
    }
    if (newIngs.length === 0) newIngs = ["ใส่ครบทุกอย่าง"];
    setSelectedIngredients(newIngs);
  };

  const toggleExcluded = (item) => {
    setExcludedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  // ✅ 3. ฟังก์ชันสลับเลือกท็อปปิ้ง
  const toggleAddon = (addon) => {
    setExtraAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon],
    );
  };

  const handleConfirm = () => {
    const options = {
      size: selectedSize.name,
      format: format,
      noodle: noodle,
      ingredients: selectedIngredients,
      excluded: excludedItems,
      extraAddons: extraAddons, // ส่งข้อมูลท็อปปิ้ง
      note: note, // ส่งข้อมูลหมายเหตุ
      totalPrice: totalPrice,
    };
    onConfirm(product, options);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300 flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
              {product?.name}
            </h3>
            <p className="text-sm text-orange-500 font-black mt-1">
              ฿{totalPrice.toLocaleString()}
              {addonPrice > 0 && (
                <span className="text-xs text-zinc-400 ml-1">
                  (+ท็อปปิ้ง {addonPrice}฿)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-gray-50 rounded-2xl text-gray-400 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1 pb-10">
          {/* 1. ขนาด */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              1. เลือกขนาด
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "S", extra: 0 },
                { name: "M", extra: 10 },
                { name: "L", extra: 20 },
              ].map((s) => (
                <button
                  key={s.name}
                  onClick={() =>
                    setSelectedSize({ name: s.name, extraPrice: s.extra })
                  }
                  className={`py-4 rounded-2xl text-sm font-black border-2 transition-all active:scale-95 ${
                    selectedSize.name === s.name
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-gray-200"
                      : "border-gray-50 bg-gray-50 text-gray-400"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </section>

          {/* 2. รูปแบบ */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              2. รูปแบบ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["น้ำ", "แห้ง"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-4 rounded-2xl text-sm font-black border-2 transition-all active:scale-95 ${
                    format === f
                      ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md shadow-orange-50"
                      : "border-gray-50 bg-gray-50 text-gray-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {/* 3. เลือกเส้น */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              3. เลือกเส้น
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["เส้นเล็ก", "เส้นใหญ่", "บะหมี่เหลือง", "หมี่ขาว"].map((t) => (
                <button
                  key={t}
                  onClick={() => setNoodle(t)}
                  className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all active:scale-95 ${
                    noodle === t
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-50 bg-gray-50 text-gray-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* 4. ส่วนผสมหลัก */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              4. ส่วนผสมหลัก
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleIngredient("ใส่ครบทุกอย่าง")}
                className={`col-span-2 py-4 rounded-2xl text-sm font-black border-2 transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  selectedIngredients.includes("ใส่ครบทุกอย่าง")
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-50 bg-gray-50 text-gray-400"
                }`}
              >
                <Check size={18} /> ใส่ครบทุกอย่าง
              </button>
              {product?.baseIngredients?.map((ing) => (
                <button
                  key={ing}
                  onClick={() => toggleIngredient(ing)}
                  className={`py-4 rounded-2xl text-xs font-bold border-2 transition-all active:scale-95 ${
                    selectedIngredients.includes(ing)
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-50 bg-gray-50 text-gray-400"
                  }`}
                >
                  {ing}
                </button>
              ))}
            </div>
          </section>

          {/* 5. สิ่งที่ไม่ใส่ */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              5. สิ่งที่ไม่ใส่ (Extra No)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["พริก", "ผัก", "กากหมู", "ถั่ว"].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleExcluded(s)}
                  className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all active:scale-95 ${
                    excludedItems.includes(s)
                      ? "border-red-500 bg-red-50 text-red-600 shadow-sm"
                      : "border-gray-50 bg-gray-50 text-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* ✅ 6. เพิ่มท็อปปิ้ง (+10 บาท) */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">
                6. เพิ่มท็อปปิ้ง (+10฿/อย่าง)
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* รายการท็อปปิ้งสามารถปรับแก้ตรงนี้ได้เลยครับ */}
              {[
                "ตับ",
                "เลือด",
                "หนังหมู",
                "ผักบุ้ง",
                "ลูกชิ้นหมู",
                "ลูกชิ้นหมูหนึบ",
                "เต้าหู้หมูหนึบ",
                "ปลาแผ่น",
                "ลูกชิ้นปลา",
                "ไส้",
                "หมูนุ่ม",
                "เกี๊ยว",
                "หมูบะช่อ",
                "ถั่วงอก",
                "หมูแดง",
              ].map((addon) => (
                <button
                  key={addon}
                  onClick={() => toggleAddon(addon)}
                  className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all active:scale-95 ${
                    extraAddons.includes(addon)
                      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                      : "border-gray-50 bg-gray-50 text-gray-400"
                  }`}
                >
                  + {addon}
                </button>
              ))}
            </div>
          </section>

          {/* ✅ 7. ช่องหมายเหตุ */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              7. หมายเหตุ (เพิ่มเติม)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ขอรสจัดๆ, แยกน้ำ, ไม่ใส่ชูรส ฯลฯ"
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all resize-none h-24 placeholder:text-gray-300 placeholder:font-medium"
            ></textarea>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 space-y-4 pb-10 sm:pb-8">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              รวมค่าอาหาร
            </span>
            <span className="text-3xl font-black text-zinc-900 tabular-nums">
              ฿{totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 font-black text-gray-400 text-xs uppercase tracking-widest active:scale-95"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfirm}
              className="flex-[2] bg-zinc-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-gray-200 active:scale-95 transition-all hover:bg-orange-600"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;
