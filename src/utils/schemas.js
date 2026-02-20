import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "ชื่ออาหารต้องไม่ว่าง"),
  price: z.number().positive("ราคาต้องมากกว่า 0"),
  quantity: z.number().int().min(1, "จำนวนต้องอย่างน้อย 1"),
  options: z.array(z.string()).default([]),
});

export const orderSchema = z.object({
  tableNumber: z.number().int().positive(),
  cartItems: z.array(cartItemSchema),
  totalAmount: z.number().nonnegative(),
});
