import { useState, useEffect } from "react";
import { X, Loader2, Plus, Hash } from "lucide-react";
import { z } from "zod";
import { createProduct, updateProduct } from "../../api/axios";

const productSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อเมนู"),
  price: z.number().positive("ราคาต้องมากกว่า 0"),
  category: z.enum(["ก๋วยเตี๋ยว", "ของกินเล่น", "เครื่องดื่ม"]),
  img: z.string().url("รูปแบบ URL ไม่ถูกต้อง").optional().or(z.literal("")),
  baseIngredients: z.array(z.string()).optional(), // รองรับ Array ของ String
});

const ProductModal = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "ก๋วยเตี๋ยว",
    img: "",
    baseIngredients: [], // ✅ เพิ่มสถานะเริ่มต้นเป็น Array ว่าง
  });

  const [tempIngredient, setTempIngredient] = useState(""); // สำหรับช่อง Input วัตถุดิบ
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        category: initialData.category || "ก๋วยเตี๋ยว",
        img: initialData.img || "",
        baseIngredients: initialData.baseIngredients || [], // โหลดข้อมูลเดิม
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "ก๋วยเตี๋ยว",
        img: "",
        baseIngredients: [],
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  // ✅ ฟังก์ชันเพิ่มวัตถุดิบ (Tag)
  const handleAddIngredient = (e) => {
    if (e.key === "Enter" && tempIngredient.trim()) {
      e.preventDefault();
      if (!formData.baseIngredients.includes(tempIngredient.trim())) {
        setFormData({
          ...formData,
          baseIngredients: [...formData.baseIngredients, tempIngredient.trim()],
        });
      }
      setTempIngredient("");
    }
  };

  // ✅ ฟังก์ชันลบวัตถุดิบ
  const removeIngredient = (ing) => {
    setFormData({
      ...formData,
      baseIngredients: formData.baseIngredients.filter((i) => i !== ing),
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const cleanData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category,
      img: formData.img || "",
      baseIngredients: formData.baseIngredients, // ✅ ส่ง Array ไปที่ Backend
    };

    try {
      productSchema.parse(cleanData);
      setIsSubmitting(true);

      if (initialData?.id) {
        await updateProduct(initialData.id, cleanData);
      } else {
        await createProduct(cleanData);
      }
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors);
      } else {
        console.error("API Error:", err);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      {/* ปรับให้ Modal เด้งขึ้นมาจากด้านล่างบนมือถือ และอยู่กลางจอเมื่อจอใหญ่ */}
      <div className="bg-white w-full sm:max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
        <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white/50">
          <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            {initialData ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 space-y-5 max-h-[80vh] sm:max-h-[75vh] overflow-y-auto custom-scrollbar"
        >
          {/* ชื่อเมนู */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">
              ชื่อเมนู
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 font-bold outline-none transition-all ${errors.name ? "border-red-400" : "border-transparent focus:ring-2 focus:ring-orange-500"}`}
              placeholder="เช่น เส้นเล็กน้ำตกเนื้อ"
            />
          </div>

          {/* ปรับ Grid ให้รองรับหน้าจอเล็ก */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ราคา */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">
                ราคา (บาท)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 font-black outline-none transition-all ${errors.price ? "border-red-400" : "border-transparent focus:ring-2 focus:ring-orange-500"}`}
              />
            </div>
            {/* หมวดหมู่ */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">
                หมวดหมู่
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer h-[60px]"
              >
                <option value="ก๋วยเตี๋ยว">ก๋วยเตี๋ยว</option>
                <option value="ของกินเล่น">ของกินเล่น</option>
                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
              </select>
            </div>
          </div>

          {/* วัตถุดิบหลัก */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">
              วัตถุดิบหลัก (พิมพ์แล้วกด Enter)
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={tempIngredient}
                onChange={(e) => setTempIngredient(e.target.value)}
                onKeyDown={handleAddIngredient}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                placeholder="เช่น ตับ, เนื้อเปื่อย..."
              />

              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-1">
                {formData.baseIngredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="bg-orange-50 text-orange-600 pl-3 pr-1 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 border border-orange-100"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ing)}
                      className="p-1 hover:bg-orange-200 rounded-lg transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ปุ่มกดสำหรับ Mobile: ปรับขนาดให้เต็มความกว้างและกดง่าย */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="order-1 sm:order-2 flex-[2] bg-zinc-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "บันทึกข้อมูล"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 py-4 font-black text-gray-400 uppercase text-xs tracking-widest"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
