import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  tableNumber: null,

  setTableNumber: (num) => set({ tableNumber: num }),

  addToCart: (product, options = []) => {
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex(
      (item) =>
        item.name === product.name &&
        JSON.stringify(item.options) === JSON.stringify(options),
    );

    if (existingIndex !== -1) {
      const newCart = [...currentCart];
      newCart[existingIndex].quantity += 1;
      set({ cart: newCart });
    } else {
      set({
        cart: [...currentCart, { ...product, quantity: 1, options }],
      });
    }
  },

  removeFromCart: (index) => {
    const currentCart = get().cart;
    const newCart = currentCart.filter((_, i) => i !== index);
    set({ cart: newCart });
  },

  updateQuantity: (index, newQty) => {
    const currentCart = get().cart;

    if (newQty < 1) {
      const newCart = currentCart.filter((_, i) => i !== index);
      set({ cart: newCart });
      return;
    }

    const newCart = [...currentCart];
    newCart[index] = { ...newCart[index], quantity: newQty };
    set({ cart: newCart });
  },

  clearCart: () => set({ cart: [], tableNumber: null }),

  getTotalPrice: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const itemPrice = item.options?.totalPrice || item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  },
  resetDailyStats: () => {
    set({
      cart: [],
      tableNumber: null,
      // ถ้ามี state สำหรับเก็บยอดขายวันนี้ หรือเลขบิล ก็ให้ reset ที่นี่
    });
    alert("เริ่มต้นวันใหม่เรียบร้อยแล้ว!");
  },
}));

export default useCartStore;
