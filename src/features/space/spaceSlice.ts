import { createSlice } from '@reduxjs/toolkit';
import { getSpaceList } from "./spaceActions";

const initialState = {
  loading: false,
  spaceInfo: {},
  spaceList: [],
  spaceId: null,
  error: null,
  success: false,
} as any;


const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    setSpace: (state: any, { payload }: any) => {
      console.log("setSpace", payload?.info?.id);
      state.spaceId = payload?.info?.id;
      // state.restaurantInfo = payload?.info;
      return state;
    }

  },
  extraReducers: (builder: any) => {
    builder
      .addCase(getSpaceList.pending, (state: any, { payload }: any) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(getSpaceList.fulfilled, (state: any, { payload }: any) => {
        state.loading = false;
        state.spaceList = payload;
        state.spaceId = state.spaceId && payload?.find((item: any) => item.id === state.spaceId) ? state.spaceId:  payload?.[0]?.id;
        // state.restaurantInfo = state.restaurantId ? payload?.find((item: any) => item.id === state.restaurantId) : payload?.[0];
        return state;
      })
      .addCase(getSpaceList.rejected, (state: any, { payload }: any) => {
        state.loading = false;
        state.error = payload;
        return state;
      })
  }
} as any);

export const { setSpace } = spaceSlice.actions;
export default spaceSlice.reducer;