import {useEffect,useState} from "react";
import ProductCard from "../components/ProductCard";
import {getProducts} from "../api/productApi";
const Products=()=>{
  const [products,setProducts]=useState([]);
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("");
  const [error,setError]=useState("");
  const load=async()=>{
    try{
      const d=await getProducts({search,category});
      setProducts(d.products||[]);
    }catch(e){setError(e.response?.data?.message||"Failed to load products");}
  };
  useEffect(()=>{load();},[category]);
  return <div className="page-container">
    <h1>Marketplace</h1>
    <form onSubmit={e=>{e.preventDefault();load();}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."/>
      <button>Search</button>
    </form>
    <select value={category} onChange={e=>setCategory(e.target.value)}>
      <option value="">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Fashion">Fashion</option>
      <option value="Books">Books</option>
      <option value="Home">Home</option>
    </select>
    {error&&<p className="error">{error}</p>}
    <div className="product-grid">
      {products.map(p=><ProductCard key={p._id} product={p}/>)}
    </div>
  </div>;
};
export default Products;