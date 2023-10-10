import React from "react";
import { userStateContext } from "../context/ContextProvider";

export default function AdminInfo() {
    const { currentUser, userToken, setCurrentUser, setUserToken } =
        userStateContext();

    const user = JSON.parse(currentUser);
    return (
        <div className="mt-4">
            <div className="mb-5">
                <h1>Welcome back {user.name}!</h1>
            </div>
            <div className="fs-5">
                <p>
                    <span className="fw-bold">Account ID:</span> {user.id}
                </p>
            </div>
            <div className="fs-5">
                <p>
                    <span className="fw-bold">Full name:</span> {user.name}
                </p>
            </div>
            <div className="fs-5">
                <p>
                    <span className="fw-bold">Email address:</span> {user.email}
                </p>
            </div>
        </div>
    );
}
