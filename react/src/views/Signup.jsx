import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { userStateContext } from "../context/ContextProvider";
import axiosClient from '../axios';

export default function Signup() {
    const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ __html: "" });

    if (userToken) {
        return <Navigate to="/" />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setError({ __html: "" });

        axiosClient.get('/csrf-cookie').then(() => {
            axiosClient
                .post("/signup", {
                    name: fullName,
                    email: email,
                    password: password,
                })
                .then(({ data }) => {
                    setCurrentUser(data.user);
                    setUserToken(data.token);
                })
                .catch((error) => {
                    if(error.response) {
                        const formErrors = Object.values(error.response.data.errors).reduce((accum, next) => 
                        [...next, ...accum] ,[]);
    
                        setError({__html: formErrors.join('<br>')})
                    } else {
                        console.error(error);
                    }
                });
        })
    };
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4 mx-auto">
                    <div>
                        <p className="text-dark fs-4 fw-bold">
                            Customer bank management Signup
                        </p>
                        <div className="mb-3">
                            <Link className="text-decoration-none" to="/login">
                                Or Login with your account
                            </Link>
                        </div>
                        {error.__html && (<div className="text-danger mb-3" dangerouslySetInnerHTML={error}></div>)}
                        <form
                            method="POST"
                            action="#"
                            onSubmit={(e) => handleSubmit(e)}
                        >
                            <div className="mb-3 form-group">
                                <label className="form-label" htmlFor="fullName">
                                    Full name
                                </label>
                                <input
                                    className="form-control"
                                    name="fullName"
                                    type="text"
                                    placeholder="Enter full name"
                                    required
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 form-group">
                                <label className="form-label" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    className="form-control"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 form-group">
                                <label className="form-label" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="form-control"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your account password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="text-end mt-4">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Signup
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
