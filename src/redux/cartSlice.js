import { createSlice } from '@reduxjs/toolkit'




const initialState = {
  cartItems: [],
}

export const cartSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
  
    addCart: (state, action) => {
        const newItem = action.payload;
        const existItem = state.cartItems.find((item) => item._id === newItem._id);
      
        const updatedCartItems = existItem
          ? state.cartItems.map((item) =>
              item._id === existItem._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...state.cartItems, { ...newItem, quantity: 1 }];
      
        return { ...state, cartItems: updatedCartItems };
      },
      clearCart:()=>initialState
  },
})


export const {addCart,clearCart } = cartSlice.actions

export default cartSlice.reducer