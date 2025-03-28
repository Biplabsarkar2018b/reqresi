import axios from "axios";

const API_URL = "https://reqres.in/api";

export const login = async (data) => axios.post(`${API_URL}/login`, data);
export const getUsers = async (page) =>
  axios.get(`${API_URL}/users?page=${page}`);
export const updateUser = async (id, data) =>{
    console.log('user : ', data);
  let res = await axios.put(`${API_URL}/users/${id}`, data);
  console.log(res.status);
}
export const deleteUser = async (id) => axios.delete(`${API_URL}/users/${id}`);
