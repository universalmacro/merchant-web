import { createSlice } from '@reduxjs/toolkit';
import { getRestaurantInfo } from "./restaurantActions";

// // initialize userToken from local storage
// const restaurantId = localStorage.getItem('restaurantId')
//   ? localStorage.getItem('restaurantId')
//   : null;


const initialState = {
  loading: false,
  restaurantInfo: {},
  restaurantList: [],
  restaurantId: null,
  error: null,
  success: false,
} as any;


const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurant: (state: any, { payload }: any) => {
      console.log("setRestaurant", payload?.info?.id);
      state.restaurantId = payload?.info?.id;
      state.restaurantInfo = payload?.info;
      return state;
    }

  },
  extraReducers: (builder: any) => {
    builder
      .addCase(getRestaurantInfo.pending, (state: any, { payload }: any) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(getRestaurantInfo.fulfilled, (state: any, { payload }: any) => {
        state.loading = false;
        state.restaurantList = payload;
        state.restaurantId = state.restaurantId && payload?.find((item: any) => item.id === state.restaurantId) ? state.restaurantId:  payload?.[0]?.id;
        state.restaurantInfo = state.restaurantId ? payload?.find((item: any) => item.id === state.restaurantId) : payload?.[0];
        return state;
      })
      .addCase(getRestaurantInfo.rejected, (state: any, { payload }: any) => {
        state.loading = false;
        state.error = payload;
        return state;
      })
  }
} as any);

export const { setRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;