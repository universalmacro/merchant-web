import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { basePath } from "../../utils/constant";
import sha256 from 'crypto-js/sha256';

export const userLogin = createAsyncThunk(
	'auth/login',
	async ({ userName, password }: any, { rejectWithValue }) => {
		let infoResponse = null;
		try {
			const { data } = await axios.post(`${basePath}/sessions`, {
				'account': userName,
				'password': sha256(sha256(password).toString()).toString(),
			});
			// if(data?.token){
			// 	localStorage.setItem('merchant-web-token', data.token);
			//   // get userInfo 
			// 	infoResponse = await axios.get(`${basePath}/admins/self`, { headers: {Authorization: `Bearer ${data?.token}`}});
			// }
			// return {...data, info: infoResponse?.data};
			return { ...data};
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
				infoResponse = await axios.get(`${basePath}/admins/self`, { headers: {Authorization: `Bearer ${token}`}});
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