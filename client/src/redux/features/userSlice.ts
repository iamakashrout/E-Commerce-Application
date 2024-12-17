import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userId: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: string; token: string }>) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
