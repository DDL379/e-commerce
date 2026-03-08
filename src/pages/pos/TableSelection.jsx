import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  getTablesStatus,
  checkoutOrder,
  cancelOrder,
  getOrCreateOrder,
  addOrderItems,
} from "../../api/axios";
import { LayoutGrid, RefreshCcw, X, Printer, Plus } from "lucide-react";
import TableCard from "../../components/pos/TableCard";
import CheckoutModal from "../../components/pos/CheckoutModal";

const TableSelection = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // ✅ State สำหรับ View Modal & Reprint
  const [showViewModal, setShowViewModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await getTablesStatus();
      setTables(response.data);
    } catch (error) {
      console.error("Fetch tables failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCancelTable = async (tableId, orderId) => {
    try {
      await cancelOrder(orderId);
      fetchTables();
    } catch (error) {
      console.error("ยกเลิกโต๊ะไม่สำเร็จ", error);
      alert("เกิดข้อผิดพลาดในการยกเลิกโต๊ะ");
    }
  };

  const handlePayment = async (paymentData, discountCount = 0) => {
    try {
      if (discountCount > 0) {
        const discountItems = Array(discountCount).fill({
          name: "🎟️ บัตรส่วนลด",
          price: -60,
          quantity: 1,
          options: {
            isDiscount: true,
            totalPrice: -60,
          },
        });

        await addOrderItems({
          orderId: selectedTable.orderId,
          cartItems: discountItems,
        });
      }

      let finalMethod = paymentData.method;
      if (paymentData.method === "SPLIT") {
        finalMethod = `SPLIT_CASH=${paymentData.cashAmount}_TRANSFER=${paymentData.transferAmount}`;
      }

      await checkoutOrder(selectedTable.orderId, {
        paymentMethod: finalMethod,
      });

      setShowCheckout(false);
      fetchTables();
    } catch (error) {
      console.error("Payment failed", error);
      alert("เกิดข้อผิดพลาดในการชำระเงิน");
    }
  };
  // ✅ ฟังก์ชันเปิด Modal และดึงข้อมูลออเดอร์มาดู
  const handleViewOrder = async (table) => {
    setSelectedTable(table);
    setShowViewModal(true);
    setIsLoadingOrder(true);
    try {
      // ใช้ API เดิมในการดึงข้อมูลออเดอร์ปัจจุบัน
      const res = await getOrCreateOrder(table.id);
      setOrderDetails(res.data?.data || res.data);
    } catch (error) {
      console.error("Fetch order details failed", error);
      alert("ไม่สามารถดึงข้อมูลออเดอร์ได้");
      setShowViewModal(false);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const handleReprint = () => {
    console.log("ข้อมูลออเดอร์ก่อนปริ้น:", orderDetails);

    const itemsToPrint = orderDetails?.items || orderDetails?.cartItems || [];

    if (itemsToPrint.length === 0) {
      alert(
        "ไม่พบรายการอาหารที่จะปริ้นครับ (อาจจะไม่มีรายการอาหาร หรือดึงข้อมูลผิดพลาด)",
      );
      return;
    }

    const printData = {
      tableNumber: selectedTable.id,
      items: itemsToPrint,
    };

    localStorage.setItem("print_order_data", JSON.stringify(printData));

    setShowViewModal(false);

    navigate("/print-order");
  };

  return (
    <div className="flex flex-col gap-6 pb-32 min-h-full">
      {/* Header Section */}
      <header className="px-2 flex justify-between items-end pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-orange-500 rounded-lg text-white">
              <LayoutGrid size={16} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter italic">
              Floor <span className="text-orange-500">Plan</span>
            </h2>
          </div>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            {tables.filter((t) => t.status === "busy").length}{" "}
            โต๊ะที่กำลังใช้บริการ
          </p>
        </div>

        <button
          onClick={fetchTables}
          className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 active:rotate-180 transition-all duration-500 shadow-sm"
        >
          <RefreshCcw size={18} />
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-300 font-black text-[10px] tracking-[0.4em] uppercase">
            Scanning Tables...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 px-2 animate-in fade-in zoom-in-95 duration-500">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onNavigate={(id) => navigate(`order/${id}`)}
              onCheckout={(t) => {
                setSelectedTable(t);
                setShowCheckout(true);
              }}
              onCancelTable={handleCancelTable}
              onViewOrder={handleViewOrder} // ✅ โยนฟังก์ชันเข้าไปในการ์ด
            />
          ))}
        </div>
      )}

      {/* สรุปสถานะสั้นๆ */}
      {!loading && (
        <div className="px-4 mt-4">
          <div className="bg-zinc-100/50 rounded-3xl p-4 flex justify-around items-center border border-zinc-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-900 rounded-full" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Busy
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal แสดงรายละเอียดออเดอร์ & ปุ่มปริ้นซ้ำ */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                  รายละเอียดโต๊ะ {selectedTable?.id}
                </h3>
                <p className="text-sm text-orange-500 font-bold mt-1">
                  ยอดปัจจุบัน: ฿
                  {selectedTable?.totalAmount?.toLocaleString() || 0}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-3 bg-gray-50 rounded-2xl text-gray-400 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content (รายการอาหาร) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 custom-scrollbar">
              {isLoadingOrder ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                </div>
              ) : (
                (() => {
                  // ✅ ดึงข้อมูลแบบเผื่อไว้ทั้ง items และ cartItems
                  const displayItems =
                    orderDetails?.items || orderDetails?.cartItems || [];

                  if (displayItems.length > 0) {
                    return (
                      <div className="divide-y divide-gray-100">
                        {displayItems
                          .filter(
                            (i) =>
                              !i.options?.isDiscount &&
                              !i.name?.includes("บัตรส่วนลด"),
                          )
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className="py-3 flex justify-between items-start gap-4"
                            >
                              <div className="flex-1">
                                <p className="font-black text-zinc-900 text-sm">
                                  <span className="text-orange-500 mr-2">
                                    {item.quantity}x
                                  </span>
                                  {item.menuName || item.name}
                                </p>
                                <div className="mt-1 flex flex-col gap-0.5">
                                  {item.options?.noodle && (
                                    <p className="text-[11px] font-bold text-zinc-500">
                                      {item.options.noodle} •{" "}
                                      {item.options.format}
                                    </p>
                                  )}
                                  {item.options?.extraAddons?.length > 0 && (
                                    <p className="text-[10px] font-bold text-blue-500">
                                      + {item.options.extraAddons.join(", ")}
                                    </p>
                                  )}
                                  {item.options?.note && (
                                    <p className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded w-fit mt-1">
                                      📝 {item.options.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <p className="font-black text-zinc-900 text-sm">
                                ฿
                                {Number(
                                  item.price * item.quantity,
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-10 text-zinc-400 font-bold text-sm">
                        ไม่มีรายการอาหาร
                      </div>
                    );
                  }
                })()
              )}
            </div>

            {/* Modal Footer (ปุ่มกด) */}
            <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 flex gap-3 pb-8 sm:pb-8">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate(`/order/${selectedTable.id}`); // ✅ ใส่ / นำหน้าเพื่อความชัวร์เรื่อง Path
                }}
                className="flex-[1] py-4 bg-white border-2 border-zinc-200 text-zinc-600 rounded-2xl font-black flex justify-center items-center gap-2 active:scale-95 transition-all text-sm"
              >
                <Plus size={18} /> สั่งเพิ่ม
              </button>

              {/* ✅ ปลดล็อกปุ่ม ถ้ามี items หรือ cartItems อย่างใดอย่างหนึ่ง */}
              <button
                onClick={handleReprint}
                disabled={
                  isLoadingOrder ||
                  !(
                    orderDetails?.items?.length > 0 ||
                    orderDetails?.cartItems?.length > 0
                  )
                }
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black flex justify-center items-center gap-2 shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:bg-gray-300 disabled:shadow-none text-sm"
              >
                <Printer size={18} /> ปริ้นใบครัวซ้ำ
              </button>
            </div>
          </div>
        </div>
      )}
      <CheckoutModal
        isOpen={showCheckout}
        table={selectedTable}
        onClose={() => setShowCheckout(false)}
        onPayment={handlePayment}
      />
    </div>
  );
};

export default TableSelection;
