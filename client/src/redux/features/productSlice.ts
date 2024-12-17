import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:5000/api/products/getAllProducts");
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.error || "Failed to fetch products");
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
