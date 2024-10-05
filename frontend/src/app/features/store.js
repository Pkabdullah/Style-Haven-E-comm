import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slice";
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist';

// Configuration for redux-persist
const persistConfig = {
    key: 'root',    // Key for local storage
    storage,        // Defines the storage method (localStorage in this case)
    whitelist: ['cart','selectedProduct','orders'], // Define which slices of state to persist
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, cartSlice);

// Configure the store
const store = configureStore({
    reducer: {
        cart: persistedReducer
    }
});

// Persist the store
export const persistor = persistStore(store);

export default store;


// import { configureStore } from "@reduxjs/toolkit";
// import cartSlice from "./slice"

// const store =configureStore({
//     reducer:{
//         cart:cartSlice
//     }
// })
// export default store


// using redux persist   

