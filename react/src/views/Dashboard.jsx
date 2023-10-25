import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userStateContext } from "../context/ContextProvider";
import CustomerNavbar from "../components/CustomerNavbar";


export default function Dashboard() {
    const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext();

    if (!userToken) {
        return <Navigate to="/login" />;
    }

    const user = JSON.parse(currentUser);

    if(user.role_as === 1) {
        return <Navigate to="/404" />;
    }

    return (
        <div>
            <div>
                <CustomerNavbar/>
            </div>
            <div className="container pt-3">
                <div className="row">
                    <div className="col-md-12 mt-xl-4">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    );
}
