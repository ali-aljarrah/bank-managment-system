import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userStateContext } from "../context/ContextProvider";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext();

  const user = JSON.parse(currentUser);

  if (!userToken) {
    return <Navigate to="/login" />;
  }

  if(user.role_as === 0) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div>
        <AdminNavbar/>
      </div>
      <div className="container pt-3">
          <div className="row">
              <div className="col-md-12 mt-xl-4">
                  <Outlet/>
              </div>
          </div>
      </div>
    </div>
  )
}
