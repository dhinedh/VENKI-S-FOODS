import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      const qtyToAdd = newItem.quantity || 1;
      state.totalQuantity += qtyToAdd;
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: qtyToAdd,
          totalPrice: newItem.price * qtyToAdd,
          name: newItem.name,
          image: newItem.image,
        });
      } else {
        existingItem.quantity += qtyToAdd;
        existingItem.totalPrice += (newItem.price * qtyToAdd);
      }
      state.totalAmount = state.items.reduce((acc, item) => acc + item.totalPrice, 0);
    },
    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;

      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
      state.totalAmount = state.items.reduce((acc, item) => acc + item.totalPrice, 0);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
