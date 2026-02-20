import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import useCartStore from "../../store/useCartStore";
import { ArrowLeft, Search, UtensilsCrossed } from "lucide-react";
import OptionsModal from "../../components/pos/OptionsModal";
import CartView from "../../components/pos/CartView";
import ProductListItem from "../../components/pos/ProductListItem";
import KitchenModal from "../../components/pos/KitchenModal";
import { getProducts, getOrCreateOrder } from "../../api/axios";

const categories = ["ทั้งหมด", "ก๋วยเตี๋ยว", "ของกินเล่น", "เครื่องดื่ม"];

const OrderPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, getTotalPrice } = useCartStore();

  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState("ทั้งหมด");
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);

  const [showKitchenTicket, setShowKitchenTicket] = useState(false);
  const [kitchenData, setKitchenData] = useState(null);

  useEffect(() => {
    const initOrder = async () => {
      try {
        const response = await getOrCreateOrder(tableId);
        setCurrentOrder(response.data);
      } catch (error) {
        console.error("ไม่สามารถเปิดโต๊ะได้", error);
      }
    };
    initOrder();
  }, [tableId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data.data || response.data);
      } catch (error) {
        console.error("ดึงข้อมูลเมนูไม่สำเร็จ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    if (product.category === "ก๋วยเตี๋ยว") {
      setActiveProduct(product);
    } else {
      addToCart(product, []);
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 relative min-h-full pb-40">
      {/* Header - เพิ่มความโปร่งและอ่านง่าย */}
      <header className="flex items-center justify-between sticky top-0 bg-[#F8F9FA]/80 backdrop-blur-md z-30 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pos")}
            className="p-3 bg-white rounded-2xl shadow-sm border border-zinc-100 text-zinc-400 active:scale-90 transition-all"
          >
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tighter italic">
              Table {tableId}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Ordering Mode
              </p>
            </div>
          </div>
        </div>

        {/* ไอคอนประดับให้ดูเป็นร้านอาหาร */}
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-300">
          <UtensilsCrossed size={18} />
        </div>
      </header>

      {/* Categories - ปรับให้เลื่อนสมูทและปุ่มเด่นขึ้น */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCat(c)}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all uppercase tracking-wider ${
              selectedCat === c
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                : "bg-white text-zinc-400 border border-zinc-100 hover:border-zinc-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product List - ปรับ Grid ให้รองรับหน้าจอที่กว้างขึ้นเล็กน้อย */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-zinc-100 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-zinc-300 font-black text-[10px] tracking-[0.3em] uppercase">
              Preparing Menu...
            </p>
          </div>
        ) : (
          products
            .filter(
              (p) => selectedCat === "ทั้งหมด" || p.category === selectedCat,
            )
            .map((p) => (
              <ProductListItem
                key={p.id}
                product={p}
                onClick={handleSelectProduct}
              />
            ))
        )}
      </div>

      {/* 🛒 Floating Cart Button - ปรับให้เป็น 'Pill Shape' ที่ดูหรูหราขึ้น */}
      {cart.length > 0 && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 sm:px-6 z-40 animate-in slide-in-from-bottom-10 duration-500">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-zinc-900 text-white p-4 sm:p-5 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex items-center justify-between active:scale-95 hover:bg-zinc-800 transition-all group border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-orange-500 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-2xl text-[11px] flex items-center justify-center font-black shadow-lg shadow-orange-500/40 rotate-12 group-hover:rotate-0 transition-transform">
                  {cart.length}
                </div>
              </div>
              <div className="text-left">
                <span className="block font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 leading-none mb-1">
                  รายการอาหาร
                </span>
                <span className="font-black text-sm uppercase">
                  Review Order
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-[1px] bg-zinc-700 mx-1" />
              <span className="font-black text-xl sm:text-2xl tabular-nums italic">
                ฿{getTotalPrice().toLocaleString()}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      <CartView
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        orderId={currentOrder?.id}
        tableId={tableId}
        onSuccess={(data) => {
          setKitchenData(data);
          setShowKitchenTicket(true);
        }}
      />

      <OptionsModal
        isOpen={!!activeProduct}
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onConfirm={(p, opts) => {
          addToCart(p, opts);
          setActiveProduct(null);
        }}
      />

      <KitchenModal
        isOpen={showKitchenTicket}
        onClose={() => {
          setShowKitchenTicket(false);
          setKitchenData(null);
        }}
        orderData={kitchenData}
      />
    </div>
  );
};

export default OrderPage;
