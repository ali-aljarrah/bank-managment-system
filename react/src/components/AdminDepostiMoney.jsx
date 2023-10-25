import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Spinner from "react-bootstrap/Spinner";
import Swal from 'sweetalert2';

export default function AdminDepostiMoney() {
  const [accountNumber, setAccountNumber] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [allAccounts, setAllAccounts] = useState({});
  const [error, setError] = useState({ __html: "" });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    await axiosClient
        .get("/getAccounts")
        .then((response) => {
            const accountsData = response.data.data.data;
            setAllAccounts(accountsData);
        })
        .catch((error) => {
            console.error(error);
        });
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    setRefresh(true);
    setError({ __html: "" });

    axiosClient.get('/csrf-cookie').then(() => {
      axiosClient
      .post("/AdminDeposit", {
          account: accountNumber,
          amount: depositAmount
      })
      .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Deposit done successfully',
            showConfirmButton: false,
            timer: 2500
        });
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
        <p className="fs-3 fw-bold">Deposit money to customer account</p>
        {error.__html && (<div className="text-danger mb-3" dangerouslySetInnerHTML={error}></div>)}
      </div>
      <form action="#" method="POST" onSubmit={(e) => handleDeposit(e) }>
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="form-group">
              <label className="form-label" htmlFor="accountNumber">Account</label>
              <select value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="form-select" name="accountNumber" id="accountNumber">
                <option value="">Choose account number</option>
                {Array.isArray(allAccounts) ? allAccounts.map((account) => {
                  return (
                    <option key={account.id} value={account.account_number}>
                      {account.account_number} | {account.email}
                    </option>
                  )
                }) : null
                }
              </select>
            </div>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="form-group">
              <label className="form-label" htmlFor="depositAmount">Deposit amount</label>
              <input placeholder="Enter the amount you wish to deposit" className="form-control" type="number" name="depositAmount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
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
                              Deposit{" "}
                          </span>
                      )}
                  </button>
              </div>
          </div>
        </div>
      </form>
    </div>
  )
}
