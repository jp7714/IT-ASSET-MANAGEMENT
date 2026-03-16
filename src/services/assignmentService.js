import axios from "axios";

const API_URL = "http://localhost:3000/assignments";

export const getAssignments = () => axios.get(API_URL);

export const assignAsset = (assignment) => axios.post(API_URL, assignment);

export const updateAssignment = (id, assignment) => axios.put(`${API_URL}/${id}`, assignment);

export const deleteAssignment = (id) => axios.delete(`${API_URL}/${id}`);
