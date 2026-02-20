import { Link, useLocation } from "react-router";

const SidebarItem = ({ item }) => {
  const location = useLocation();
  // ตรวจสอบ Path เพื่อ Hilight เมนูที่เลือกอยู่
  const isActive = location.pathname.startsWith(item.path);

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group active:scale-95 ${
        isActive
          ? "bg-zinc-900 text-white shadow-xl shadow-gray-200"
          : "hover:bg-gray-50 text-zinc-400 hover:text-zinc-900"
      }`}
    >
      {/* Icon: ปรับขนาดให้คงที่และเพิ่มสีสันตอน Active */}
      <div
        className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
      >
        {item.icon}
      </div>

      {/* Label: ปรับ Font ให้หนาขึ้นตามสไตล์ POS ของคุณแบงค์ */}
      <span
        className={`text-sm font-black tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}
      >
        {item.label}
      </span>

      {/* ✅ เพิ่มขีดสถานะด้านข้างเมื่อ Active ให้ดูชัดเจนขึ้น */}
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full" />
      )}
    </Link>
  );
};

export default SidebarItem;
