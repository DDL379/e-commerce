import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

import MainLayout from "../layouts/MainLayout";
import TableSelection from "../pages/pos/TableSelection";
import OrderPage from "../pages/pos/OrderPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import AdminPage from "../pages/admin/AdminPage";
import OrderHistoryPage from "../pages/pos/OrderHistoryPage";
import DailyReportPage from "../pages/pos/DailyReportPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/pos" replace />,
      },
      {
        path: "pos",
        children: [
          {
            index: true,
            element: <TableSelection />,
          },
          {
            path: "order/:tableId",
            element: <OrderPage />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      { path: "daily-report", element: <DailyReportPage /> },
      {
        path: "admin",
        element: <AdminPage />,
      },
      { path: "history", element: <OrderHistoryPage /> },
    ],
  },
  {
    path: "*",
    element: (
      <div className="p-10 text-center text-2xl font-bold">
        404 - ไม่พบหน้านี้
      </div>
    ),
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
