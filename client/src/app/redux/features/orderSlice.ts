import { SelectedProduct, Total } from "@/types/order";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface OrderState {
    user: string | null;
    products: SelectedProduct[] | null;
    paymentMode: string | null;
    address: string | null;
    total: Total | null;
}

const initialState: OrderState = {
    user:  null,
    products: [],
    paymentMode: null,
    address: null,
    total: null,
}

const Slice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrder: (state, action: PayloadAction<{user: string; products: SelectedProduct[]; paymentMode: string; address: string; total: Total}>)=>{
            state.user=action.payload.user;
            state.products=action.payload.products;
            state.paymentMode=action.payload.paymentMode;
            state.address=action.payload.address;
            state.total=action.payload.total;
        },
        clearOrder: (state) => {
            state.user=null;
            state.products=null;
            state.paymentMode=null;
            state.address=null;
            state.total=null;
        }
    }
});

export const { setOrder, clearOrder } = Slice.actions;

export default Slice.reducer;