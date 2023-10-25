import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { userStateContext } from "../context/ContextProvider";
import axiosClient from "../axios";
import Spinner from 'react-bootstrap/Spinner';

export default function AdminLogin() {
    const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [disabpeBtn, setDisableBtn] = useState(false);

    if (userToken) {
        return <Navigate to="/adminDashboard" />;
    }

    

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setDisableBtn(true);
        setError({ __html: "" });

        axiosClient.get('/csrf-cookie').then(() => {
            axiosClient
                .post("/AdminLogin", {
                    email: email,
                    password: password,
                })
                .then(({ data }) => {
                    setDisableBtn(false);
                    setCurrentUser(data.user);
                    setUserToken(data.token);
                })
                .catch((error) => {
                    setDisableBtn(false);
                    if (error.response) {
                        setError({ __html: error.response.data.error });
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
                            Admin bank management Login
                        </p>
                        <div className="mb-3">
                        <Link className="text-decoration-none" to="/adminSignup">
                            Create an admin account
                        </Link>
                    </div>
                        {error.__html && (
                            <div
                                className="text-danger mb-3"
                                dangerouslySetInnerHTML={error}
                            ></div>
                        )}
                        <form
                            method="POST"
                            action="#"
                            onSubmit={(e) => handleLoginSubmit(e)}
                        >
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
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 form-group">
                                <label
                                    className="form-label"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    className="form-control"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your account password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div className="text-end mt-4">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={disabpeBtn}
                                >
                                    {disabpeBtn ? 
                                        <Spinner animation="border" role="status" size="sm">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner> :  <span className="btn-text">Login</span>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
