import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getSpaceList = createAsyncThunk(
  'space/list',
  async ({ token, url }: any, { rejectWithValue }) => {
    try {
      // const { data } = await axios.get(`${url}/spaces`, {
      //   headers: {
      //     'Content-Type': 'application/json;charset=UTF-8',
      //     'Authorization': `Bearer ${token}`,
      //   }
      // });
      // const list = data?.items;
 
      // console.log(list);
      // return list;
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