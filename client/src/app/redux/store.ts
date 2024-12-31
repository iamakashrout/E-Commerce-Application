import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
import userReducer from "./features/userSlice";
import orderReducer from "./features/orderSlice";

// Persist configuration for the userState, login needs to persist after refresh
const persistConfig = {
    key: "userState",
    storage,
};

const persistOrderConfig = {
    key: "orderState",
    storage,
}

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedOrderReducer = persistReducer(persistOrderConfig, orderReducer);

export const store = configureStore({
    reducer: {
        userState: persistedUserReducer,
        orderState: persistedOrderReducer,
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