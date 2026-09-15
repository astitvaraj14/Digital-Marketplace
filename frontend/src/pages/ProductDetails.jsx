import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {getProductById} from "../api/productApi";
const ProductDetails=()=>{
  const {id}=useParams();
  const [product,setProduct]=useState(null);
  const [error,setError]=useState("");
  useEffect(()=>{
    getProductById(id).then(d=>setProduct(d.product))
      .catch(e=>setError(e.response?.data?.message||"Product not found"));
  },[id]);
  if(error)return <div className="page-container"><p className="error">{error}</p></div>;
  if(!product)return <div className="page-container"><p>Loading...</p></div>;
  return <div className="page-container">
    <h1>{product.name}</h1>
    {product.image&&<img src={product.image} alt={product.name}/>}
    <p>{product.description}</p>
    <h2>n{Number(product.price).toFixed(2)}</h2>
    <p>Category: {product.category}</p>
    <p>Stock: {product.stock}</p>
    {product.seller&&<p>Seller: {product.seller.storeName||product.seller.name}</p>}
  </div>;
};
export default ProductDetails;