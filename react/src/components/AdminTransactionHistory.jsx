import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Moment from "moment";

export default function AdminTransactionHistory() {
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    await axiosClient
        .get("/getTransactions")
        .then((response) => {
            const transactionsData = response.data.data;
            setTransactions(transactionsData);
        })
        .catch((error) => {
            console.error(error);
        });
  };

  return (
    <div className='mt-4'>
      <p className="fs-3 fw-bold">Customers transactions</p>
      <div className="table-responsive mt-5">
        <table className="table table-striped table-hover">
          <thead>
              <tr>
                  <th>Transaction ID</th>
                  <th>From email</th>
                  <th>From number</th>
                  <th>To email</th>
                  <th>To account</th>
                  <th>Transfared amount</th>
                  <th>Created at</th>
              </tr>
          </thead>
          <tbody>
              {Array.isArray(transactions) ? transactions.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.customer_email_from}</td>
                    <td>{transaction.account_from}</td>
                    <td>{transaction.customer_email_to}</td>
                    <td>{transaction.account_to}</td>
                    <td>{transaction.amount}</td>
                    <td>
                        {Moment(transaction.created_at).format(
                            "MMMM Do, YYYY H:mma"
                        )}
                    </td>
                  </tr>
                )
              }) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
