import {useEffect,useState} from "react";
import api from "../../api/axios";
const SellerDashboard=()=>{
  const [data,setData]=useState(null);
  const [error,setError]=useState("");
  useEffect(()=>{
    api.get("/sellers/dashboard")
      .then(r=>setData(r.data))
      .catch(e=>setError(e.response?.data?.message||"Failed to load dashboard"));
  },[]);
  if(error)return <div className="page-container"><p className="error">{error}</p></div>;
  if(!data)return <div className="page-container"><p>Loading...</p></div>;
  return <div className="page-container">
    <h1>Seller Dashboard</h1><p>Welcome, {data.seller.name}</p>
    <div className="dashboard-grid">
      <div>Total Products: {data.statistics.totalProducts}</div>
      <div>Active Products: {data.statistics.activeProducts}</div>
      <div>Total Stock: {data.statistics.totalStock}</div>
    </div>
  </div>;
};
export default SellerDashboard;