import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
import userReducer from "./features/userSlice";
import orderReducer from "./features/orderSlice";
import sellerReducer from "./features/sellerSlice";
import themeReducer from "./features/themeSlice";

// Persist configuration for the userState, login needs to persist after refresh
const persistUserConfig = {
    key: "userState",
    storage,
};

const persistOrderConfig = {
    key: "orderState",
    storage,
}

const persistSellerConfig = {
    key: "sellerState",
    storage,
}

const persistThemeConfig = {
    key: "themeState",
    storage,
}

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);
const persistedOrderReducer = persistReducer(persistOrderConfig, orderReducer);
const persistedSellerReducer = persistReducer(persistSellerConfig, sellerReducer);
const persistedThemeReducer = persistReducer(persistThemeConfig, themeReducer);

export const store = configureStore({
    reducer: {
        userState: persistedUserReducer,
        orderState: persistedOrderReducer,
        sellerState: persistedSellerReducer,
        themeState: persistedThemeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;