import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface SellerState {
    sellerName: string | null,
    sellerEmail: string | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: SellerState = {
    sellerName: null,
    sellerEmail: null,
    token: null,
    isAuthenticated: false,
}

const Slice = createSlice({
    name: 'seller',
    initialState,
    reducers: {
        setSeller: (state, action: PayloadAction<{sellerName: string; sellerEmail: string; token: string}>)=>{
            state.sellerName = action.payload.sellerName;
            state.sellerEmail = action.payload.sellerEmail;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        clearSeller: (state) => {
            state.sellerName = null;
            state.sellerEmail = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setSeller, clearSeller } = Slice.actions;

export default Slice.reducer;