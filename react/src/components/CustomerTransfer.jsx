import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/esm/Spinner";

export default function CustomerTransfer() {
    const [customerAccounts, setCustomerAccounts] = useState({});
    const [anotherCustomerAccounts, setAnotherCustomersAccounts] = useState({});
    const [accountFrom, setAccountFrom] = useState("");
    const [accountTo, setAccountTo] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchCustomerAccounts();
        fetechAnotherCustomersAccounts();
    }, []);

    const fetchCustomerAccounts = async () => {
        await axiosClient
            .get("/getCustomerAccounts")
            .then((response) => {
                const accountsData = response.data.accounts.data;
                setCustomerAccounts(accountsData);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetechAnotherCustomersAccounts = async () => {
        await axiosClient
            .get("/getAnotherCustomerAccounts")
            .then((response) => {
                const accountsData = response.data.accounts;
                setAnotherCustomersAccounts(accountsData);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCustomerTransfer = (e) => {
        e.preventDefault();
        setRefresh(true);
        setError({ __html: "" });

        axiosClient.get("/csrf-cookie").then(() => {
            axiosClient
                .post("/customerTransfer", {
                    accountFrom: accountFrom,
                    accountTo: accountTo,
                    amount: amount,
                })
                .then((response) => {
                    Swal.fire({
                        icon: "success",
                        title: "Transfer done successfully",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                    setRefresh(false);
                })
                .catch((error) => {
                    console.log(error)
                    setRefresh(false);
                    if(error.response.data.error) {
                        Swal.fire({
                            icon: "error",
                            title: error.response.data.error,
                            showConfirmButton: false,
                            timer: 2500,
                        });
                    } else if (error.response) {
                        setError({ __html: error.response.data.message });
                    } else {
                        
                    }
                });
        });
    };

    return (
        <div className="mt-4">
            <div className="my-3">
                <p className="fs-3 fw-bold">
                    Transfer money to another account with the same country
                </p>
                {error.__html && (
                    <div
                        className="text-danger mb-3"
                        dangerouslySetInnerHTML={error}
                    ></div>
                )}
            </div>
            <div>
                <form
                    action="#"
                    method="POST"
                    className="mt-5"
                    onSubmit={(e) => handleCustomerTransfer(e)}
                >
                    <div className="row">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="customerAccounts"
                                >
                                    Choose your account
                                </label>
                                <select
                                    value={accountFrom}
                                    onChange={(e) =>
                                        setAccountFrom(e.target.value)
                                    }
                                    className="form-select"
                                    name="customerAccounts"
                                    id="customerAccounts"
                                >
                                    <option value="" defaultValue>
                                        Select account
                                    </option>
                                    {Array.isArray(customerAccounts)
                                        ? customerAccounts.map((account) => {
                                              return (
                                                  <option
                                                      key={account.id}
                                                      value={account.id}
                                                  >
                                                      {account.account_number} |{" "}
                                                      {account.account_country}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="form-group">
                                <label
                                    htmlFor="transferToAccount"
                                    className="form-label"
                                >
                                    Account to trasfer
                                </label>
                                <select
                                    className="form-select"
                                    value={accountTo}
                                    onChange={(e) =>
                                        setAccountTo(e.target.value)
                                    }
                                    name="transferToAccount"
                                    id="transferToAccount"
                                >
                                    <option value="" defaultValue>
                                        Select account
                                    </option>
                                    {Array.isArray(anotherCustomerAccounts)
                                        ? anotherCustomerAccounts.map(
                                              (account) => {
                                                  return (
                                                      <option
                                                          key={account.id}
                                                          value={account.id}
                                                      >
                                                          {
                                                              account.account_number
                                                          }{" "}
                                                          |{" "}
                                                          {
                                                              account.account_country
                                                          }
                                                      </option>
                                                  );
                                              }
                                          )
                                        : null}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <div className="form-group">
                                <label htmlFor="amount" className="form-label">
                                    Amount
                                </label>
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="form-control"
                                    name="amount"
                                    type="number"
                                    placeholder="Enter the amount"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="text-end">
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
                                            Transfer{" "}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
