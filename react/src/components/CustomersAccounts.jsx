import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Moment from "moment";

export default function CustomersAccounts() {
    const [allUsers, setAllUsers] = useState({});
    const [allAccounts, setAllAccounts] = useState({});
    const [countries, setCountries] = useState({});
    const [accountEmail, setAccountEmail] = useState("");
    const [accountCountry, setAccountCountry] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchAccounts();
        fetchUsers();
        fetchCountries();
    }, [refresh]);

    const fetchAccounts = async () => {
        await axiosClient
            .get("/getAccounts")
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
    
    const fetchUsers = async () => {
        await axiosClient.get('/getUsers')
        .then((response) => {
            const usersData = response.data.data;
            setAllUsers(usersData);
        }).catch((error)=>{
            console.error(error);
        })
    }

    const handleCreateAccount = (e) => {
        e.preventDefault();
        setRefresh(true);
        setError({ __html: "" });

        axiosClient
            .post("/AdminCreateAccount", {
                email: accountEmail,
                country: accountCountry
            })
            .then((response) => {
                alert('Account created successfully');
                setRefresh(false);
            })
            .catch((error) => {
                if(error.response) {
                    setError({__html: error.response.data.error})
                } else {
                    console.error(error);
                }
            });

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
                                >
                                    Create account
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="table-responsive mt-5">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Account ID</th>
                            <th>Account email</th>
                            <th>Account number</th>
                            <th>Account country</th>
                            <th>Account balance</th>
                            <th>Created at</th>
                            <th>Updated at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(allAccounts)
                            ? allAccounts.map((account) => {
                                  return (
                                      <tr key={account.id}>
                                          <td>{account.id}</td>
                                          <td>{account.email}</td>
                                          <td>{account.account_number}</td>
                                          <td>{account.account_country}</td>
                                          <td>{account.account_symbol} {account.balance}</td>
                                          <td>
                                              {Moment(account.created_at).format(
                                                  "MMMM Do, YYYY H:mma"
                                              )}
                                          </td>
                                          <td>
                                              {Moment(account.updated_at).format(
                                                  "MMMM Do, YYYY H:mma"
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })
                            : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
