import { useState, useEffect } from "react";
import {
  Banknote,
  CreditCard,
  X,
  Ticket,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";

const CheckoutModal = ({ isOpen, table, onClose, onPayment }) => {
  const [discountCount, setDiscountCount] = useState(0);
  const [cashAmount, setCashAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // เคลียร์ค่าทั้งหมดเมื่อเปิด Modal ใหม่
  useEffect(() => {
    setDiscountCount(0);
    setCashAmount("");
    setTransferAmount("");
  }, [isOpen, table]);

  if (!isOpen) return null;

  // คำนวณยอดเงินต่างๆ
  const originalTotal = Number(table?.totalAmount || 0);
  const discountAmount = discountCount * 60;
  const netTotal = Math.max(0, originalTotal - discountAmount);

  const currentCash = Number(cashAmount) || 0;
  const currentTransfer = Number(transferAmount) || 0;
  const totalInput = currentCash + currentTransfer;
  const remaining = netTotal - totalInput;

  // เช็คว่ายอดเงินเป๊ะพอดีไหม
  const isMatched = remaining === 0;

  // ฟังก์ชันกดยืนยันชำระเงิน
  const handleConfirm = () => {
    if (!isMatched) return;

    // กำหนดประเภทการจ่ายเงิน
    let method = "SPLIT";
    if (currentCash === netTotal) method = "CASH";
    if (currentTransfer === netTotal) method = "TRANSFER";

    // ส่งข้อมูลกลับไปให้ TableSelection
    const paymentData = {
      method,
      cashAmount: currentCash,
      transferAmount: currentTransfer,
    };

    onPayment(paymentData, discountCount);
  };

  // ปุ่มคีย์ลัด (จ่ายเงินสดเต็ม / โอนเต็ม)
  const setAllCash = () => {
    setCashAmount(netTotal);
    setTransferAmount("");
  };

  const setAllTransfer = () => {
    setTransferAmount(netTotal);
    setCashAmount("");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center gap-5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-gray-300 hover:text-gray-500 sm:hidden"
        >
          <X size={20} />
        </button>

        <div className="text-center mt-2 sm:mt-0 w-full">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">
            Payment Summary
          </p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            โต๊ะ {table?.id}
          </h3>

          <div className="mt-3 bg-red-50 px-6 py-4 rounded-3xl w-full border border-red-100">
            {discountCount > 0 && (
              <div className="flex justify-between items-center text-sm font-bold text-gray-400 mb-1 line-through">
                <span>ยอดเดิม</span>
                <span>฿{originalTotal.toLocaleString()}</span>
              </div>
            )}
            <p className="text-red-500 font-bold text-[10px] uppercase tracking-widest mb-1">
              ยอดชำระสุทธิ
            </p>
            <p className="text-5xl font-[1000] text-red-500 tabular-nums tracking-tighter">
              ฿{netTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* บัตรส่วนลด */}
        <div className="w-full bg-orange-50/50 border border-orange-100 rounded-[1.5rem] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
              <Ticket size={20} />
            </div>
            <div>
              <p className="font-black text-zinc-900 text-xs">
                บัตรส่วนลด (-60฿)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-2 py-1.5 rounded-2xl shadow-sm border border-orange-100">
            <button
              onClick={() => {
                setDiscountCount(Math.max(0, discountCount - 1));
                setCashAmount("");
                setTransferAmount(""); // รีเซ็ตเงินเมื่อยอดเปลี่ยน
              }}
              className={`p-1 rounded-xl transition-all ${discountCount > 0 ? "text-orange-600 hover:bg-orange-50" : "text-gray-300 cursor-not-allowed"}`}
              disabled={discountCount === 0}
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <span className="font-black text-sm w-4 text-center text-zinc-900">
              {discountCount}
            </span>
            <button
              onClick={() => {
                setDiscountCount(discountCount + 1);
                setCashAmount("");
                setTransferAmount(""); // รีเซ็ตเงินเมื่อยอดเปลี่ยน
              }}
              className="p-1 text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* 💵 แยกชำระเงิน */}
        <div className="w-full space-y-3">
          {/* ช่องเงินสด */}
          <div className="flex items-center gap-3 relative">
            <div className="absolute left-4 text-green-500">
              <Banknote size={20} />
            </div>
            <input
              type="number"
              placeholder="0"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="w-full pl-12 pr-16 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl font-black text-xl text-zinc-900 outline-none transition-all"
            />
            <button
              onClick={setAllCash}
              className="absolute right-3 text-[10px] font-black bg-green-100 text-green-700 px-2 py-1.5 rounded-lg active:scale-95"
            >
              เต็มจำนวน
            </button>
          </div>

          {/* ช่องเงินโอน */}
          <div className="flex items-center gap-3 relative">
            <div className="absolute left-4 text-blue-500">
              <CreditCard size={20} />
            </div>
            <input
              type="number"
              placeholder="0"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full pl-12 pr-16 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl font-black text-xl text-zinc-900 outline-none transition-all"
            />
            <button
              onClick={setAllTransfer}
              className="absolute right-3 text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1.5 rounded-lg active:scale-95"
            >
              เต็มจำนวน
            </button>
          </div>

          {/* สรุปยอดขาด/เกิน */}
          <div
            className={`text-center py-2 rounded-xl text-sm font-black transition-colors ${
              remaining > 0
                ? "text-orange-500 bg-orange-50"
                : remaining < 0
                  ? "text-red-500 bg-red-50"
                  : "text-green-600 bg-green-50"
            }`}
          >
            {remaining > 0
              ? `ขาดอีก ฿${remaining.toLocaleString()}`
              : remaining < 0
                ? `ยอดเกิน ฿${Math.abs(remaining).toLocaleString()} !`
                : "ยอดเงินถูกต้อง"}
          </div>
        </div>

        {/* ปุ่มกดยืนยัน */}
        <div className="w-full mt-2 space-y-2">
          <button
            onClick={handleConfirm}
            disabled={!isMatched}
            className={`w-full py-4 sm:py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-2 transition-all ${
              isMatched
                ? "bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isMatched ? <CheckCircle2 size={24} /> : null}
            ยืนยันการชำระเงิน
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-400 py-3 font-bold text-sm tracking-widest uppercase hover:text-gray-600"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
