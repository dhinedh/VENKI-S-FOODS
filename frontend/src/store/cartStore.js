import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand store with persist middleware (localStorage key: "cart")
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of { id, name, price, image, is_veg, qty }

      addItem: (product, qty = 1) => {
        const { items } = get();
        const existingItem = items.find(item => String(item.id) === String(product.id));

        if (existingItem) {
          // If item exists increment qty
          set({
            items: items.map(item =>
              String(item.id) === String(product.id) ? { ...item, qty: item.qty + qty } : item
            )
          });
        } else {
          // Else push with qty 1 or the provided qty
          set({
            items: [...items, { ...product, qty }]
          });
        }
      },

      removeItem: (id) => {
        // filter out item
        set({
          items: get().items.filter(item => String(item.id) !== String(id))
        });
      },

      updateQty: (id, qty) => {
        const { items } = get();
        if (qty <= 0) {
          // remove if qty reaches 0
          set({ items: items.filter(item => String(item.id) !== String(id)) });
        } else {
          // update qty
          set({
            items: items.map(item =>
              String(item.id) === String(id) ? { ...item, qty } : item
            )
          });
        }
      },

      clearCart: () => {
        // set items to empty array
        set({ items: [] });
      },

      // Computed Selectors
      getTotal: () => {
        // compute sum of price * qty for all items
        return get().items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      },

      getCount: () => {
        // compute sum of all qty values
        return get().items.reduce((count, item) => count + item.qty, 0);
      }
    }),
    {
      name: 'cart-storage', // name of the item in storage
    }
  )
);

export default useCartStore;
