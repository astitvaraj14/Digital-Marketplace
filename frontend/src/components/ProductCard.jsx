import {Link} from "react-router-dom";
const ProductCard=({product})=>(
  <div className="product-card">
    {product.image?<img src={product.image} alt={product.name}/>:<div>No Image</div>}
    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <p><strong>n{Number(product.price).toFixed(2)}</strong></p>
    <p>Stock: {product.stock}</p>
    <Link to={`/products/${product._id}`}>View Product</Link>
  </div>
);
export default ProductCard;