import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Moment from "moment";
import Spinner from "react-bootstrap/Spinner";
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

export default function CustomersAccounts() {
    const [allUsers, setAllUsers] = useState({});
    const [allAccounts, setAllAccounts] = useState({});
    const [page, setPage] = useState(1);
    const countPerPage = 5;
    const [countries, setCountries] = useState({});
    const [accountEmail, setAccountEmail] = useState("");
    const [accountCountry, setAccountCountry] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [refresh, setRefresh] = useState(false);

    const columns = [
        {
            name: 'Account ID',
            selector: row => row.id,
            sortable: true,
            id: 'Account ID',
            style: {
                maxWidth: '130px'
            }
        },
        {
            name: 'Account email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Account number',
            selector: row => row.account_number,
            sortable: true
        },
        {
            name: 'Account country',
            selector: row => row.account_country,
            sortable: true
        },
        {
            name: 'Account balance',
            selector: row => row.account_symbol + " " +row.balance,
            sortable: true
        },
        {
            name: 'Created at',
            selector: row => Moment(row.created_at).format("MMMM Do, YYYY H:mma"),
            sortable: true
        },
        {
            name: 'Updated at',
            selector: row => Moment(row.updated_at).format("MMMM Do, YYYY H:mma"),
            sortable: true
        },
    ];

    useEffect(() => {
        fetchAccounts();
        fetchUsers();
        fetchCountries();
    }, [refresh, page]);

    const fetchAccounts = () => {
        axiosClient
            .get(`/getAccounts?page=${page}&per_page=${countPerPage}&delay=1`)
            .then((response) => {
                const accountsData = response.data.data;
                setAllAccounts(accountsData);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchCountries = async () => {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data);
    };
    
    const fetchUsers = () => {
        axiosClient.get('/getUsers')
        .then((response) => {
            const usersData = response.data.data.data;
            setAllUsers(usersData);
        }).catch((error)=>{
            console.error(error);
        })
    }

    const handleCreateAccount = (e) => {
        e.preventDefault();
        setRefresh(true);
        setError({ __html: "" });

        axiosClient.get('/csrf-cookie').then(() => {
            axiosClient
                .post("/AdminCreateAccount", {
                    email: accountEmail,
                    country: accountCountry
                })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Account created successfully',
                        showConfirmButton: false,
                        timer: 2500
                    });
                    accountEmail("");
                    setRefresh(false);
                })
                .catch((error) => {
                    setRefresh(false);
                    if(error.response) {
                        setError({__html: error.response.data.message})
                    } else {
                        console.error(error);
                    }
                });
        })

    }
    
    return (
        <div className="mt-4">
            <div className="my-3">
                <p className="fs-3 fw-bold">Create a new customer's account</p>
                {error.__html && (<div className="text-danger mb-3" dangerouslySetInnerHTML={error}></div>)}
                <form action="#" method="POST" onSubmit={(e) => handleCreateAccount(e)}>
                    <div className="row">
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="form-group">
                                <label
                                    htmlFor="customerEmail"
                                    className="form-label"
                                >
                                    Customer email
                                </label>
                                <select value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} className="form-select" name="customerEmail" id="customerEmail">
                                    <option defaultValue value="">Choose customer</option>
                                    {Array.isArray(allUsers) ? allUsers.map((user, i) => {
                                            return (
                                                <option key={i} value={user.email}>{user.name}</option>
                                            )
                                        }) : null
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="form-group">
                                <label htmlFor="customerCountry" className="form-label">Customer account country</label>
                                <select value={accountCountry} onChange={(e) => setAccountCountry(e.target.value)} className='form-select' name="customerCountry">
                                    <option defaultValue value="">Choose country</option>
                                    {Array.isArray(countries) ? countries.map((country, i) => {
                                            let countryName = country.name.common ? country.name.common : '';
                                            let countrySymbol = country.currencies ? Object.values(country.currencies)[0].symbol : '$';
                                            return (
                                                <option key={i} value={countrySymbol+`|`+countryName}>{countrySymbol+` `+countryName}</option>
                                            )
                                        }) : null
                                    }
                                </select>
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
                                            Create account{" "}
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
                    columns={columns} 
                    data={allAccounts.data} 
                    pagination 
                    paginationServer
                    paginationTotalRows={allAccounts.total}
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
