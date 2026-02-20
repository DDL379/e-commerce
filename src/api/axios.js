import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7777/api",
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ";

    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error(`ข้อมูลไม่ถูกต้อง: ${message}`);
          break;
        case 404:
          toast.error("ไม่พบข้อมูลที่ต้องการ");
          break;
        case 500:
          toast.error("ระบบหลังบ้านขัดข้อง กรุณาลองใหม่ภายหลัง");
          break;
        default:
          toast.error(message);
      }
    } else {
      toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }

    return Promise.reject(error);
  },
);
// Order API
export const getOrCreateOrder = (tableNumber) =>
  axiosInstance.get(`/orders/table/${tableNumber}`);
export const addOrderItems = (orderData) =>
  axiosInstance.post("/orders/add-items", orderData);
export const checkoutOrder = (id, paymentData) =>
  axiosInstance.patch(`/orders/${id}/checkout`, paymentData);
export const getReceipt = (id) => axiosInstance.get(`/orders/${id}/receipt`);
export const getTablesStatus = () => axiosInstance.get("/orders/tables-status");
export const getOrderHistory = (type = "daily", date = new Date()) =>
  axiosInstance.get(`/orders/history`, { params: { type, date } });
export const cancelOrder = (orderId) =>
  axiosInstance.delete(`/orders/${orderId}`);

// Product API
export const getProducts = () => axiosInstance.get("/products");
export const getAllProducts = () => axiosInstance.get("/products");
export const createProduct = (data) => axiosInstance.post("/products", data);
export const updateProduct = (id, data) =>
  axiosInstance.patch(`/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);

// Dashboard API
export const getSalesSummary = () => axiosInstance.get("/dashboard/daily");
export const getDailyReport = (date) => {
  return axios.get(`/dashboard/summary?date=${date.toISOString()}`);
};

export default axiosInstance;
