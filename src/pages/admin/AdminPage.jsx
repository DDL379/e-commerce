import { useState, useEffect } from "react";
import { Plus, Edit, Loader2, Package, Power, Search } from "lucide-react";
import ProductModal from "../../components/admin/ProductModal";
import { getAllProducts, deleteProduct } from "../../api/axios";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // ✅ เพิ่ม Search ให้ Admin หาเมนูง่ายขึ้น
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      const data = response.data.data || response.data || [];
      setProducts(data);
    } catch (error) {
      console.error("ดึงข้อมูลเมนูไม่สำเร็จ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, name, currentStatus) => {
    const action = currentStatus ? "ปิดการใช้งาน" : "เปิดการใช้งาน";
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการ ${action} เมนู "${name}"?`)) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert("ไม่สามารถดำเนินการได้");
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 px-4 sm:px-6 lg:px-0 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col gap-6 pt-6 sm:pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tighter">
              จัดการเมนู <span className="text-orange-500">อาหาร</span>
            </h2>
            <p className="text-zinc-500 font-bold text-xs sm:text-sm uppercase tracking-widest mt-1">
              {products.length} Items in your kitchen
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl active:scale-95"
          >
            <Plus size={20} strokeWidth={4} />
            <span>เพิ่มเมนูใหม่</span>
          </button>
        </div>

        {/* ✅ เพิ่มช่องค้นหาเมนู (สะดวกเวลาเมนูเยอะ) */}
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อเมนู..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </header>

      {loading ? (
        <div className="py-32 text-center">
          <Loader2 className="animate-spin mx-auto text-orange-500" size={48} />
          <p className="mt-4 text-zinc-400 font-bold text-sm tracking-widest">
            LOADING MENU...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-100">
          <Package size={48} className="mx-auto mb-4 text-zinc-200" />
          <p className="text-zinc-400 font-bold tracking-widest uppercase text-xs">
            ไม่พบรายการที่ค้นหา
          </p>
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white p-5 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden transition-all active:scale-[0.98] ${!product.isActive ? "bg-zinc-50/50 grayscale-[0.5] opacity-70" : ""}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-1.5 h-12 rounded-full ${product.isActive ? "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]" : "bg-zinc-300"}`}
                    />
                    <div>
                      <h3 className="font-black text-zinc-900 text-lg leading-tight truncate max-w-[180px]">
                        {product.name}
                      </h3>
                      <span className="inline-block mt-1 text-[9px] font-black bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="p-3 bg-zinc-50 text-zinc-400 rounded-2xl active:bg-orange-500 active:text-white transition-all shadow-sm"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() =>
                        handleToggleStatus(
                          product.id,
                          product.name,
                          product.isActive,
                        )
                      }
                      className={`p-3 rounded-2xl transition-all shadow-sm ${product.isActive ? "bg-zinc-50 text-zinc-400 active:bg-red-500 active:text-white" : "bg-green-100 text-green-600"}`}
                    >
                      <Power size={18} />
                    </button>
                  </div>
                </div>

                {/* ✅ ปรับการแสดงผลวัตถุดิบให้เป็น Flex Wrap เพื่อไม่ให้ล้น Card */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {product.baseIngredients?.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-white border border-zinc-100 text-zinc-400 px-2.5 py-1 rounded-lg font-bold shadow-sm"
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-50 flex justify-between items-center">
                  <div
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${product.isActive ? "text-green-500" : "text-zinc-400"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-green-500 animate-pulse" : "bg-zinc-300"}`}
                    />
                    {product.isActive ? "In Stock" : "Out of Order"}
                  </div>
                  <div className="font-black text-2xl text-zinc-900 tabular-nums">
                    ฿{Number(product.price).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden md:block bg-white rounded-[3rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="px-8 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">
                    Menu Details
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">
                    Ingredients
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] text-right">
                    Price
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-zinc-50/80 transition-all group ${!product.isActive ? "bg-zinc-50/50 opacity-60" : ""}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-1 h-10 rounded-full ${product.isActive ? "bg-orange-500 shadow-lg shadow-orange-200" : "bg-zinc-200"}`}
                        />
                        <div>
                          <div className="font-black text-zinc-900 text-base tracking-tight">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                        {product.baseIngredients?.map((ing, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-zinc-50 text-zinc-400 border border-zinc-100 px-2.5 py-1 rounded-lg font-bold"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-zinc-900 text-xl tabular-nums">
                      ฿{Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-[1.25rem] transition-all active:scale-90"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              product.id,
                              product.name,
                              product.isActive,
                            )
                          }
                          className={`p-3 rounded-[1.25rem] transition-all active:scale-90 ${product.isActive ? "text-zinc-400 hover:text-white hover:bg-red-500" : "text-green-500 hover:bg-green-50"}`}
                        >
                          <Power size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProducts();
        }}
        initialData={selectedProduct}
      />
    </div>
  );
};

export default AdminPage;
