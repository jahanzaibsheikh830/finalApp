import React, { useEffect, useState } from "react";
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import URL from '../../baseUrl/BaseUrl'

function Home() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: URL + '/getProducts',
            withCredentials: true
        }).then((response) => {
            setProducts(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <main className="container">
            <h1 className="text-center mt-5 ">Products</h1>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 mt-5" key={product.id}>
                        <div>
                            <img className="w-100" height="200" src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <div>PKR: {product.price}/- Per kg</div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home