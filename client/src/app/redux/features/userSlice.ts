import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    userEmail: string | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    userEmail: null,
    token: null,
    isAuthenticated: false,
}

const Slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{userEmail: string; token: string}>)=>{
            state.userEmail = action.payload.userEmail;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.userEmail = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setUser, clearUser } = Slice.actions;

export default Slice.reducer;