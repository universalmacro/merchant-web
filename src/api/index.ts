import {
  RestaurantApi,
  Configuration,
  ConfigurationParameters,
} from "@dparty/restaurant-ts-sdk";
import axios from "axios";
const token = localStorage.getItem("userToken");
export const restaurantBasePath = "https://uat.api.universalmacro.com/restaurant";
export const basePath = "https://uat.api.universalmacro.com/core";

export const restaurantApi = new RestaurantApi(
  new Configuration({
    basePath: restaurantBasePath,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } as ConfigurationParameters)
);



export const getRestaurant = async (params: any) => {
  const res = await axios.get(`${restaurantBasePath}/restaurants`, params);
  return res.data;
};

export const getAdmins = async (params: any) => {
  const res = await axios.get(`${basePath}/admins`, params);
  return res.data;
};

export const createAdmins = async (data: any, config: any) => {
  const res = await axios.post(`${basePath}/admins`, data, config);
  return res.data;
};

export const getAdminInfo = async (id: string, params: any) => {
  const res = await axios.get(`${basePath}/admins/${id}`, params);
  return res.data;
};

export const deleteAdmin = async (id: string, config: any) => {
  const res = await axios.delete(`${basePath}/admins/${id}`, config);
  return res.data;
};

export const updateAdminPassword = async (id: string, data: any, config: any) => {
  const res = await axios.put(`${basePath}/admins/${id}/password`, data, config);
  return res.data;
};

export const updateSelfPassword = async (data: any, config: any) => {
  const res = await axios.put(`${basePath}/admins/self/password`, data, config);
  return res.data;
};

export const getNodes = async (params: any) => {
  const res = await axios.get(`${basePath}/nodes`, params);
  return res.data;
};

export const createNode = async (data: any, config: any) => {
  const res = await axios.post(`${basePath}/nodes`, data, config);
  return res.data;
};

export const createRestaurant = async (data: any, config: any) => {
  const res = await axios.post(`${restaurantBasePath}/restaurants`, data, config);
  return res.data;
};

export const updateRestaurant = async (id: string, data: any, config: any) => {
  const res = await axios.put(`${restaurantBasePath}/restaurants/${id}`, data, config);
  return res.data;
};

export const deleteRestaurant = async (id: string, config: any) => {
  const res = await axios.delete(`${restaurantBasePath}/restaurants/${id}`, config);
  return res.data;
};

export const getBillList = async (params: any) => {
  const res = await axios.get(`${restaurantBasePath}/bills`, params);
  return res.data;
};

export const getPrinters = async (id: string, config: any) => {
  const res = await axios.get(`${restaurantBasePath}/restaurants/${id}/printers`, config);
  return res.data;
};

export const getDiscounts = async (id: string, config: any) => {
  const res = await axios.get(`${restaurantBasePath}/restaurants/${id}/discounts`, config);
  return res.data;
};

export const createItem = async (id: string, data: any, config: any) => {
  const res = await axios.post(`${restaurantBasePath}/restaurants/${id}/items`, data, config);
  return res.data;
};

export const updateItem = async (id: string, data: any, config: any) => {
  const res = await axios.put(`${restaurantBasePath}/items/${id}`, data, config);
  return res.data;
};

export const createTable = async (id: string, data: any, config: any) => {
  const res = await axios.post(`${restaurantBasePath}/restaurants/${id}/tables`, data, config);
  return res.data;
};

export const deleteTable = async (id: string, config: any) => {
  const res = await axios.delete(`${restaurantBasePath}/tables/${id}`, config);
  return res.data;
};

export const updateTable = async (id: string, data: any, config: any) => {
  const res = await axios.put(`${restaurantBasePath}/tables/${id}`, data, config);
  return res.data;
};

// discount
export const createDiscount = async (id: string, data: any, config: any) => {
  const res = await axios.post(`${restaurantBasePath}/restaurants/${id}/discounts`, data, config);
  return res.data;
};

export const deleteDiscount = async (id: string, config: any) => {
  const res = await axios.delete(`${restaurantBasePath}/discounts/${id}`, config);
  return res.data;
};

export const updateDiscount = async (id: string, data: any, config: any) => {
  const res = await axios.put(`${restaurantBasePath}/discounts/${id}`, data, config);
  return res.data;
};

// printers
export const createPrinter = async (id: string, data: any, config: any) => {
  const res = await axios.post(`${restaurantBasePath}/restaurants/${id}/printers`, data, config);
  return res.data;
};

export const deletePrinter = async (id: string, config: any) => {
  const res = await axios.delete(`${restaurantBasePath}/printers/${id}`, config);
  return res.data;
};

export const updatePrinter = async (id: string, data: any, config: any) => {
  const res = await axios.put(`${restaurantBasePath}/printers/${id}`, data, config);
  return res.data;
};


export const deleteItems = async (id: string, config: any) => {
  const res = await axios.delete(`${restaurantBasePath}/items/${id}`, config);
  return res.data;
};