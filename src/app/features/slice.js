import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    selectedProduct: null,
    cart: [],
    orders:[]
   
  },
  reducers: {
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    addToCart(state, action) {
      state.cart.push(action.payload);
    },
    setCart(state,action){
      state.cart=action.payload
    },
  setOrder(state,action){
    state.orders=action.payload
  },
  clearCart(state) {
    state.cart = [];
  }
  },
});

export const { setSelectedProduct, addToCart,setCart,setOrder,clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const saveCartToLocalStorage = (cart) => {
//   localStorage.setItem("cart", JSON.stringify(cart));
// };
// const saveOrderToLocalStorage=(orders)=>{
//   localStorage.setItem("orders", JSON.stringify(orders));
// }
// const loadCartFromLocalStorage = () => {
//   const storedCart = localStorage.getItem("cart");
//   return storedCart ? JSON.parse(storedCart) : [];
// };
// const loadOrderFromLocalStorage=()=>{
//   const storedOrders = localStorage.getItem("orders");
//   return storedOrders ? JSON.parse(storedOrders) : [];
  
// }

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     selectedProduct: null,
//     cart: loadCartFromLocalStorage(),
//     orders:loadOrderFromLocalStorage() 
//   },
//   reducers: {
//     setSelectedProduct(state, action) {
//       state.selectedProduct = action.payload;
//     },
//     addToCart(state, action) {
//       state.cart.push(action.payload);
//       saveCartToLocalStorage(state.cart);
//     },
//     setCart(state, action) {
//       state.cart = action.payload;
//       saveCartToLocalStorage(state.cart); 
//     },
//     setOrder(state, action) {
//       state.orders = action.payload; 
//       saveOrderToLocalStorage(state.orders)
//     }
//   },
// });

// export const { setSelectedProduct, addToCart, setCart, setOrder } = cartSlice.actions;
// export default cartSlice.reducer;

