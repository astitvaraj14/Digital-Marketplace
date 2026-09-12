import api from "./axios";
export const getProducts=async(params={})=>{
  const r=await api.get("/products",{params}); return r.data;
};
export const getProductById=async(id)=>{
  const r=await api.get(`/products/${id}`); return r.data;
};