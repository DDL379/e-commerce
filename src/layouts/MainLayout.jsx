import { Outlet } from "react-router";
import BottomNav from "../components/layout/BottomNav";

const MainLayout = () => {
  return (
    // ✅ ใช้ h-[100dvh] (Dynamic Viewport Height) เพื่อแก้ปัญหาบน Safari Mobile ที่ชอบมีแถบ Address bar เกินออกมา
    <div className="flex flex-col h-[100dvh] bg-[#F8F9FA] overflow-hidden">
      {/* ✅ Main Content: 
         - pb-32 เพื่อเว้นที่ให้ BottomNav ไม่บังเนื้อหาท้ายหน้า
         - px-4 sm:px-6 ปรับระยะข้างตามขนาดจอ
         - scrollbar-hide (ถ้าลง plugin ไว้) หรือใช้ overflow-y-auto ปกติ
      */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-36 scrollbar-hide">
        {/* ✅ Container: 
           - max-w-[430px] คุมความกว้างให้เหมือนแอปมือถือ (ตามที่คุณแบงค์เคยตั้งไว้)
           - sm:max-w-md สำหรับหน้าจอที่กว้างขึ้นมานิดนึง
        */}
        <div className="max-w-[430px] sm:max-w-md mx-auto w-full animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>

      {/* ✅ ส่วนล่างสุดที่เป็น Navigation */}
      <div className="shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
