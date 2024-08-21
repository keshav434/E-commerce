import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            setLoading(true);
            let result = await fetch('http://localhost:4000/products', {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json();
            setProducts(result);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);  // Stop loading
        }
    }

    const deleteProduct = async (id) => {
        try {
            let result = await fetch(`http://localhost:4000/product/${id}`, {
                method: "DELETE",  // Use uppercase "DELETE"
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json();
            if (result) {
                getProducts();  // Refresh the product list after deletion
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    const searchHandle = async (event) => {
        let key = event.target.value;
        if (key) {
            try {
                let result = await fetch(`http://localhost:4000/search/${key}`, {
                    headers: {
                        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                });
                result = await result.json();
                if (result) {
                    setProducts(result);
                }
            } catch (error) {
                console.error("Error searching products:", error);
            }
        } else {
            getProducts();  // Refresh the product list if search input is cleared
        }
    }

    return (
        <div className="product-list">
            <h3>Product List</h3>
            <input 
                type="text" 
                className='search-product-box' 
                placeholder='Search Product'
                onChange={searchHandle}
            />
            <ul>
                <li>S. No</li>
                <li>Name</li>
                <li>Price</li>
                <li>Category</li>
                <li>Operation</li>
            </ul>
            {
                loading ? <h1>Loading...</h1> :
                products.length > 0 ? products.map((item, index) =>
                    <ul key={item._id}>
                        <li>{index + 1}</li>
                        <li>{item.name}</li>
                        <li>{item.price}</li>
                        <li>{item.category}</li>
                        <li>
                            <button onClick={() => deleteProduct(item._id)}>Delete</button>
                            <Link to={"/update/" + item._id}>Update</Link>
                        </li>
                    </ul>
                )
                : <h1>No results found</h1>
            }
        </div>
    )
}

export default ProductList;

