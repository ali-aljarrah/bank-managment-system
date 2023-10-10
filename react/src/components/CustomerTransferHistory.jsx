import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Moment from 'moment';

export default function CustomerTransferHistory() {
    const [customerTransactions, setCustomerTransactions] = useState({});

    useEffect(() => {
        fetechCustomerTransactions();  
    },[]);

    const fetechCustomerTransactions = async () => {
        await axiosClient.get('/getCustomerTransactions')
        .then((response) => {
            const transactionsData = response.data.transactions;
            setCustomerTransactions(transactionsData);
        }).catch((error)=>{
            console.error(error);
        })
    }

  return (
    <div className='mt-4'>
        <p className="fs-3 fw-bold">
            Check your transactions history
        </p>
        <div className="row">
            <div className="col-md-12">
                <div className="table-responsive mt-4">
                    <table className='table table-striped table-hover'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>From account</th>
                                <th>To account</th>
                                <th>Amount</th>
                                <th>Created at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(customerTransactions) ? customerTransactions.map((transaction) => {
                                return (
                                    <tr key={transaction.id}>
                                        <td>{transaction.id}</td>
                                        <td>{transaction.account_from}</td>
                                        <td>{transaction.account_to}</td>
                                        <td>{transaction.amount}</td>
                                        <td>{Moment(transaction.created_at).format('MMMM Do, YYYY H:mma')}</td>
                                    </tr>
                                );
                            }) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}
