import axios from "axios";

const API_URL = "http://localhost:3000/assets";

export const getAssets = () => axios.get(API_URL);

export const addAsset = (asset) => axios.post(API_URL, asset);

export const updateAsset = (id, asset) => axios.put(`${API_URL}/${id}`, asset);

export const deleteAsset = (id) => axios.delete(`${API_URL}/${id}`);
