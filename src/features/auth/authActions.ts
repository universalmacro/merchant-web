import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { basePath } from "../../utils/constant";
import sha256 from 'crypto-js/sha256';
import { basePath } from 'api';



export const userLogin = createAsyncThunk(
	'auth/login',
	async ({ userName, password }: any, { rejectWithValue }) => {
    let host = window.location.host;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // localhost 測試環境發送請求會報錯
      host = 'uat.uat-hongkong-1-merchant.universalmacro.com';
    } 
		try {
      const res = await axios.get(`${basePath}/nodes/config/api?domain=${host}`);
      if(res && res?.data){
        let url = res?.data?.merchantUrl;
        const { data } = await axios.post(`${url}/sessions`, {
          'account': userName,
          'password': sha256(sha256(password).toString()).toString(),
        });
        if(data?.token){
				  localStorage.setItem('merchant-web-token', data.token);
			  }
      return { ...data, basePath: url};
      }
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

export const userBasePath = createAsyncThunk(
	'auth/url',
	async ({ token }: any, { rejectWithValue }) => {
    let host = window.location.host;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // localhost 測試環境發送請求會報錯
      host = 'uat.uat-hongkong-1-merchant.universalmacro.com';
    } 
		try {
      const res = await axios.get(`${basePath}/nodes/config/api?domain=${host}`);
      if(res && res?.data){
        let url = res?.data?.merchantUrl;
        let spaces = [];
        try {
          // get space
          const res = await axios.get(`${url}/spaces`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              index: 0,
              limit: 10,
            },
          });
          if(res){
            spaces = res?.data?.items;
          }
        } catch (error: any) {
          // return custom error message from API if any
          if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
          } else {
            return rejectWithValue(error.message);
          }
        }
        // return {spaces: res?.data?.items};

        return { basePath: url, spaces: spaces};
      }
      
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


export const userSpace = createAsyncThunk(
	'auth/space',
	async ({ token, url }: any, { rejectWithValue }) => {
		try {
			// get space
      const res = await axios.get(`${url}/spaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          index: 0,
          limit: 10,
        },
      });
			return {spaces: res?.data?.items};
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


export const userInfoAuth = createAsyncThunk(
	'auth/info',
	async ({ token }: any, { rejectWithValue }) => {
		let infoResponse = null;
		try {
			if(token){
				infoResponse = await axios.get(`${basePath}/merchants/self`, { headers: {Authorization: `Bearer ${token}`}});
			}
			// get userInfo 
			return {info: infoResponse?.data};
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