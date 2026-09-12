import { useEffect, useState } from "react";
import api from "../../api/axios";

const Inventory = () => {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");


  const load = async () => {
    try {

      const response = await api.get("/inventory");

      setProducts(response.data.products || []);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to load inventory"
      );

    }
  };


  useEffect(() => {
    load();
  }, []);



  const updateStock = async (id, value) => {

    const stock = Number(value);


    if (!Number.isInteger(stock) || stock < 0) {

      setError("Stock must be a non-negative integer");
      return;

    }


    try {

      await api.patch(`/inventory/${id}/stock`, {
        stock
      });


      load();


    } catch(error){

      setError(
        error.response?.data?.message ||
        "Stock update failed"
      );

    }

  };



  return (

    <div className="page-container">

      <h1>Inventory Management</h1>


      {
        error &&
        <p className="error">
          {error}
        </p>
      }



      {
        products.map((product)=>(

          <div 
            className="product-card"
            key={product._id}
          >

            <h3>
              {product.name}
            </h3>


            <p>
              Current stock: {product.stock}
            </p>



            <input

              type="number"

              min="0"

              step="1"

              defaultValue={product.stock}


              onBlur={(e)=>
                updateStock(
                  product._id,
                  e.target.value
                )
              }

            />


          </div>

        ))
      }


    </div>

  );

};


export default Inventory;