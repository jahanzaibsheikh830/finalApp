import React from "react";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from './../home/Home.jsx'
import Login from './../login/Login.jsx'
import Signup from './../signup/Signup.jsx'
import Dashboard from './../dashboard/Dashboard.jsx'
import AdminDashboard from '../admin/adminDashboard'
import Basket from '../dashboard/cart/Basket'
import CheckOutForm from '../dashboard/cart/CheckOutForm'
import AddProducts from '../admin/AddProducts'
import MyOrders from '../dashboard/MyOrders'
import Items from '../admin/Items'
import { useGlobalState } from '../../context/globalContext'
import Navbar from '../Navbar/Navbar'
function RoutesConfig() {
    const globalState = useGlobalState()

    return (
        <div>
            <Router>
                {globalState.role === null ?
                    <div>
                        <Navbar />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/signup" component={Signup} />
                            <Route path="/login" component={Login} />
                            <Route path="*" component={Home} />
                        </Switch>
                    </div> : null}

                {globalState.role === "user" ?
                    <>
                        <Navbar />
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/basket" component={Basket} />
                            <Route path="/myorders" component={MyOrders} />
                            <Route path="/checkoutform" component={CheckOutForm} />
                            <Route path="*" component={Dashboard} />
                        </Switch>
                    </> : null
                }
                {globalState.role === "admin" ?
                    <>
                        <Navbar />
                        <Switch>
                            <Route exact path="/" component={AdminDashboard} />
                            <Route path="/addproducts" component={AddProducts} />
                            <Route path="/items" component={Items} />
                            <Route path="*" component={AdminDashboard} />
                        </Switch>
                    </> : null
                }
            </Router>
        </div>
    );
}
export default RoutesConfig