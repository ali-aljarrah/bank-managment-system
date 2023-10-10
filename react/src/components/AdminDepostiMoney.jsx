import React, { useEffect, useState } from "react";
import axiosClient from "../axios";

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
            const accountsData = response.data.data;
            setAllAccounts(accountsData);
        })
        .catch((error) => {
            console.error(error);
        });
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    setError({ __html: "" });

    axiosClient
    .post("/AdminDeposit", {
        account: accountNumber,
        amount: depositAmount
    })
    .then((response) => {
        alert('Deposit done successfully');
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
              <input placeholder="Enter the amount you wish to deposit" className="form-control" type="text" name="depositAmount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            </div>
          </div>
          <div className="col-md-12 mt-4 mb-4 mb-md-0">
              <div className="text-start">
                  <button
                      className="btn btn-primary"
                      type="submit"
                  >
                      Deposit
                  </button>
              </div>
          </div>
        </div>
      </form>
    </div>
  )
}
