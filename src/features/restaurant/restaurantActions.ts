import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { restaurantApi, restaurantBasePath } from "../../api";


export const getRestaurantInfo = createAsyncThunk(
  'restaurant/info',
  async ({ token }: any, { rejectWithValue }) => {
    try {
      // const { data } = await restaurantApi.listRestaurants();
      const { data } = await axios.get(`${restaurantBasePath}/restaurants`, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${token}`,
        }
      });
      const list = data?.data;
      if (list && list?.length > 0) {
        // localStorage.setItem('restaurantId', list[0]?.id);
      }
      console.log(list);
      return list;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);