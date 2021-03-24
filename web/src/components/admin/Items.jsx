import React, { useEffect, useState } from "react";
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import URL from '../../baseUrl/BaseUrl'
function Items() {
    const [products, setProducts] = useState([])
    const [show, setShow] = useState(true)
    const [updataData, setUpdateData] = useState([])
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

    function delItem(id) {
        axios({
            method: 'post',
            url: URL + '/delProduct',
            data: { id: id },
            withCredentials: true
        }).then((response) => {
            alert(response.data.message)
        }).catch((err) => {
            console.log(err)
        })
    }
    function updateItem(id) {
        console.log(id)
        axios({
            method: 'post',
            url: URL + '/updateProduct',
            data: { id: id },
            withCredentials: true
        }).then((response) => {
            console.log(response)
            if (response.data.status === 200) {
                setUpdateData(response.data.data)
                setShow(false)
            }
            else {
                console.log(response.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    function update() {

    }
    return (
        <main className="container">
            <div className="row justify-content-center">
                {show ?
                    <div>
                        <form>
                            <input type="text" placeholder="Search.." name="search" />
                        </form>
                        <h1 className="text-center mt-5 ">Products</h1>
                        <table class="table">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Delete</th>
                                    <th scope="col">Update</th>
                                </tr>
                            </thead>
                            {
                                products.map((v, i) => {
                                    return (
                                        <tbody>
                                            <tr>
                                                <th scope="row">{i + 1}</th>
                                                <td>{v.name}</td>
                                                <td>{v.price}</td>
                                                <td>{v.stock} Kg</td>
                                                <td>{v.description}</td>
                                                <td onClick={() => delItem(v._id)}><i className="btn btn-danger far fa-trash-alt"></i></td>
                                                <td onClick={() => updateItem(v._id)}><i className="btn btn-primary far fa-edit"></i></td>
                                            </tr>
                                        </tbody>
                                    )
                                })
                            }
                        </table> </div> :
                    <div className="col-md-6 mt-5">
                        <form onSubmit={update}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputEmail4">Product Name</label>
                                    <input type="text" className="form-control" id="pName" placeholder="Name"
                                        onChange={(e) => console.log(e)} value={updataData.name}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputPassword4">Price</label>
                                    <input type="number" className="form-control" id="price" placeholder="Price" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputEmail4">Stock</label>
                                    <input type="text" className="form-control" id="stock" placeholder="Stock" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputPassword4">Description</label>
                                    <input type="text" className="form-control" id="description" placeholder="Description" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </form><br />

                    </div>}
            </div>
        </main>
    )
}
export default Items