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

  useEffect(() => {
    if (isOpen) {
      setSelectedSize({ name: "S", extraPrice: 0 });
      setFormat("น้ำ");
      setNoodle("เส้นเล็ก");
      setSelectedIngredients(["ใส่ครบทุกอย่าง"]);
      setExcludedItems([]);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const totalPrice = (product?.price || 0) + selectedSize.extraPrice;

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

  const handleConfirm = () => {
    const options = {
      size: selectedSize.name,
      format: format,
      noodle: noodle,
      ingredients: selectedIngredients,
      excluded: excludedItems,
      totalPrice: totalPrice,
    };
    onConfirm(product, options);
    onClose();
  };

  return (
    // ✅ items-end บนมือถือเพื่อให้กดง่าย / items-center บนจอใหญ่
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      {/* ✅ ปรับความกว้างและมุมโค้งให้รับกับมือถือ */}
      <div className="bg-white w-full sm:max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300 flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header - เน้นชื่อเมนูและราคา */}
        <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
              {product?.name}
            </h3>
            <p className="text-sm text-orange-500 font-black mt-1">
              ฿{totalPrice.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-gray-50 rounded-2xl text-gray-400 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - จัด Grid ให้กดง่ายขึ้นบนนิ้วสัมผัส */}
        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1 pb-10">
          {/* 1. ขนาด - ปรับให้ปุ่มใหญ่ขึ้น */}
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

          {/* 2. รูปแบบ - น้ำ/แห้ง */}
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

          {/* 3. เลือกเส้น - ปรับ Grid 2 คอลัมน์ให้ตัวหนังสือไม่เบียด */}
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

          {/* 4. ส่วนผสม - ใช้ col-span เพื่อเน้นปุ่ม "ใส่ครบ" */}
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

          {/* 5. สิ่งที่ไม่ใส่ - ปรับเป็น 3 คอลัมน์ให้เลือกง่าย */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              5. สิ่งที่ไม่ใส่ (Extra No)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["พริก", "ผัก", "กากหมู", "ถั่ว", "ถั่วงอก", "ผักบุ้ง"].map(
                (s) => (
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
                ),
              )}
            </div>
          </section>
        </div>

        {/* Footer - ปรับให้ปุ่มยืนยันใหญ่และเด่นที่สุด */}
        <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 space-y-4 pb-10 sm:pb-8">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              รวมค่าอาหาร
            </span>
            <span className="text-3xl font-black text-zinc-900">
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
