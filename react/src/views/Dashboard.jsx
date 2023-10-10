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

    const logout = (e) => {
        e.preventDefault();
        axiosClient.post("/logout").then((res) => {
            setCurrentUser({});
            setUserToken(null);
        });
    };

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
        // <div className="container pt-3">
        //     <div className="row">
        //         <div className="col-md-12">
        //             <div className="text-end">
        //                 <a className="btn btn-danger fw-bold" href="#" onClick={(e) => logout(e)}>
        //                     Logout
        //                 </a>
        //             </div>
        //             <div className="mt-4">
        //                 <h1>Welcome back {user.name}!</h1>
        //             </div>
        //         </div>
        //         <div className="col-md-12 mt-xl-4">
        //             <Tabs defaultActiveKey="info" id="uncontrolled-tab-example" >
        //                 <Tab eventKey="info" title="Account info">
        //                     <div className="mt-4">
        //                         <div className="fs-5">
        //                             <p><span className="fw-bold">Account ID:</span> {user.id}</p>
        //                         </div>
        //                         <div className="fs-5">
        //                             <p><span className="fw-bold">Full name:</span> {user.name}</p>
        //                         </div>
        //                         <div className="fs-5">
        //                             <p><span className="fw-bold">Email address:</span> {user.email}</p>
        //                         </div>
        //                     </div>
        //                 </Tab>
        //                 <Tab eventKey="transfer" title="Transfer money">
        //                     <CustomerTransfer />
        //                 </Tab>
        //                 <Tab eventKey="transaction-history" title="Transaction history">
        //                     <CustomerTransferHistory />
        //                 </Tab>
        //             </Tabs>
        //         </div>
        //     </div>
        // </div>
    );
}
