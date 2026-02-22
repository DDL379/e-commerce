import { useEffect, useState } from "react"; // เพิ่ม useState
import { useNavigate } from "react-router";
import KitchenSlip from "../../KitchenSlip";

const PrintPage = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // ✅ 1. พยายามดึงข้อมูลจาก localStorage
    const savedData = localStorage.getItem("print_order_data");

    if (!savedData) {
      navigate("/pos");
      return;
    }

    const parsedData = JSON.parse(savedData);
    setOrderData(parsedData);

    // ✅ 2. สั่งพิมพ์
    const timer = setTimeout(() => {
      window.print();

      // เลือกได้: จะลบข้อมูลทิ้งเลยไหมหลังจากพิมพ์หน้าต่างเด้งขึ้นมา
      // localStorage.removeItem("print_order_data");
    }, 800); // เพิ่มเวลาเป็น 800ms เพื่อให้แน่ใจว่า CSS โหลดทัน

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!orderData) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col items-center">
        <KitchenSlip data={orderData} />
      </div>

      <div className="no-print p-8 flex flex-col items-center gap-4 bg-zinc-50 border-t">
        <p className="text-zinc-500 font-bold">พิมพ์ไม่ติด? หรือพิมพ์ซ้ำ?</p>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-zinc-900 text-white rounded-2xl font-black shadow-lg shadow-zinc-200"
          >
            สั่งพิมพ์อีกครั้ง
          </button>
          <button
            onClick={() => window.close()}
            className="px-8 py-3 bg-white border-2 border-zinc-200 text-zinc-600 rounded-2xl font-black"
          >
            ปิดหน้านี้
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
