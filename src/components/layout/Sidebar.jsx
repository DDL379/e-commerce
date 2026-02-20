import { LayoutDashboard, Utensils, Settings } from "lucide-react";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const menuItems = [
    { path: "/pos", icon: <Utensils size={20} />, label: "สั่งอาหาร" },
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "แดชบอร์ด",
    },
    { path: "/admin", icon: <Settings size={20} />, label: "จัดการเมนู" },
  ];

  return (
    // ✅ เพิ่ม hidden lg:flex เพื่อซ่อนบนมือถือ/แท็บเล็ตแนวตั้ง และโชว์เฉพาะจอใหญ่ (Desktop/iPad Landscape)
    <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 shrink-0">
      <div className="p-8">
        {/* ✅ ปรับ Logo ให้ดูทันสมัยเข้ากับ POS */}
        <h1 className="text-2xl font-black text-zinc-900 tracking-tighter">
          NOODLE <span className="text-orange-500">POS</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
          Admin Management
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} />
        ))}
      </nav>

      {/* ✅ เพิ่มส่วนท้ายสำหรับบอกสถานะระบบหรือชื่อผู้ใช้ */}
      <div className="p-6 border-t border-gray-50">
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-xs">
            A
          </div>
          <div>
            <p className="text-xs font-black text-zinc-900">Admin Mode</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase">
              Ready to serve
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
