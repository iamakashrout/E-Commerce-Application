import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  user: { id: string } | null; // Add user property
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  user: null, // Initialize user property
};

// Async thunk for adding item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data: { user: string; productId: string; quantity: number }, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/addToCart", data);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.error || "Failed to add item to cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.loading = false;
        state.items = action.payload; 
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;
