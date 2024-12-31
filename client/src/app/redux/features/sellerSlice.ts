import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface SellerState {
    sellerEmail: string | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: SellerState = {
    sellerEmail: null,
    token: null,
    isAuthenticated: false,
}

const Slice = createSlice({
    name: 'seller',
    initialState,
    reducers: {
        setSeller: (state, action: PayloadAction<{sellerEmail: string; token: string}>)=>{
            state.sellerEmail = action.payload.sellerEmail;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        clearSeller: (state) => {
            state.sellerEmail = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setSeller, clearSeller } = Slice.actions;

export default Slice.reducer;