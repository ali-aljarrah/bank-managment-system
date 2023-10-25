import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Moment from "moment";
import Spinner from "react-bootstrap/Spinner";
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

export default function Customers() {
    const [allUsers, setAllUsers] = useState({});
    const [page, setPage] = useState(1);
    const countPerPage = 5;
    const [countries, setCountries] = useState({});
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [refresh, setRefresh] = useState(false);

    const columns = [
        {
            name: 'Customer ID',
            selector: row => row.id,
            sortable: true,
            id: 'Customer ID',
            style: {
                maxWidth: '130px'
            }
        },
        {
            name: 'Customer name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Customer email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Created at',
            selector: row => Moment(row.created_at).format("MMMM Do, YYYY H:mma"),
            sortable: true
        },
    ];

    useEffect(() => {
        fetchUsers();
    }, [refresh,page]);

    const fetchUsers = () => {
         axiosClient
            .get(`/getUsers?page=${page}&per_page=${countPerPage}&delay=1`)
            .then((response) => {
                const usersData = response.data.data;
                setAllUsers(usersData);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCreateUSer = (e) => {
        e.preventDefault();
        setRefresh(true);
        setError({ __html: "" });

        axiosClient.get('/csrf-cookie').then(() => {
            axiosClient
                .post("/AdminCreateUser", {
                    name: fullName,
                    email: email,
                    password: password,
                })
                .then((res) => {
                    if(res.data.error) {
                        Swal.fire({
                            icon: 'error',
                            title: res.data.error,
                            showConfirmButton: false,
                            timer: 3000
                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Customer account created successfully',
                            showConfirmButton: false,
                            timer: 2500
                        });
                    }
                    setFullName("");
                    setEmail("");
                    setPassword("");
                    setRefresh(false);
                })
                .catch((error) => {
                    setRefresh(false);
                    if (error.response) {
                        const formErrors = Object.values(
                            error.response.data.errors
                        ).reduce((accum, next) => [...next, ...accum], []);
    
                        setError({ __html: formErrors.join("<br>") });
                    } else {
                        console.error(error);
                    }
                });
        })
    };

    return (
        <div className="mt-4">
            <div className="my-3">
                <p className="fs-3 fw-bold">Create a new customer</p>
                {error.__html && (
                    <div
                        className="text-danger mb-3"
                        dangerouslySetInnerHTML={error}
                    ></div>
                )}
                <form
                    action="#"
                    method="POST"
                    onSubmit={(e) => handleCreateUSer(e)}
                >
                    <div className="row">
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="form-group">
                                <label
                                    htmlFor="customerFullName"
                                    className="form-label"
                                >
                                    Customer Full name
                                </label>
                                <input
                                    placeholder="Enter customer full name"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    type="text"
                                    name="customerFullName"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="form-group">
                                <label
                                    htmlFor="customerEmail"
                                    className="form-label"
                                >
                                    Customer email
                                </label>
                                <input
                                    placeholder="Enter customer email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    name="customerEmail"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="form-group">
                                <label
                                    htmlFor="customerPassword"
                                    className="form-label"
                                >
                                    Customer Password
                                </label>
                                <input
                                    placeholder="Enter customer account password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    type="password"
                                    name="customerPassword"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-12 mt-4 mb-4 mb-md-0">
                            <div className="text-start">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={refresh}
                                >
                                    {refresh ? (
                                        <Spinner
                                            animation="border"
                                            role="status"
                                            size="sm"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </Spinner>
                                    ) : (
                                        <span className="btn-text">
                                            Create{" "}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="table-responsive mt-5">
                <DataTable 
                    title="Customers"
                    columns={columns} 
                    data={allUsers.data} 
                    pagination 
                    paginationServer
                    paginationTotalRows={allUsers.total}
                    paginationPerPage={countPerPage}
                    paginationComponentOptions={{
                        noRowsPerPage: true
                    }}
                      onChangePage={page => setPage(page)}
                />
            </div>
        </div>
    );
}
