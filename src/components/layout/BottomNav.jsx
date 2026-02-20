import { useNavigate, useLocation } from "react-router";
import { LayoutGrid, History, Settings, TrendingUp } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "โต๊ะ", path: "/pos", icon: LayoutGrid },
    { label: "ยอดขาย", path: "/dashboard", icon: TrendingUp },
    { label: "ประวัติ", path: "/history", icon: History },
    { label: "ตั้งค่า", path: "/admin", icon: Settings },
  ];

  return (
    // ✅ ลบ max-w-[430px] ออกเพื่อให้ยืดตามหน้าจอจริง หรือใช้ mx-auto ถ้าต้องการคุมความกว้างบน Tablet
    // ✅ เพิ่ม pb-safe (ถ้ามี plugin) หรือเพิ่ม padding bottom เผื่อแถบ Home ของมือถือ
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center p-3 pb-6 sm:pb-4 z-50">
      <div className="flex w-full max-w-md justify-around items-center mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              // ✅ ปรับ active state ให้เด่นขึ้นด้วยสีส้มที่คุณใช้ในหน้าอื่น
              className={`flex flex-col items-center gap-1.5 flex-1 py-1 transition-all active:scale-90 ${
                isActive ? "text-orange-500 scale-105" : "text-gray-400"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 3 : 2} />
              <span
                className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter sm:tracking-widest transition-opacity ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {item.label}
              </span>

              {/* ✅ เพิ่มจุด Dot บอกสถานะด้านล่างให้ดู Modern ขึ้น */}
              {isActive && (
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
