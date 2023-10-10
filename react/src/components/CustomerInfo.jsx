import React, { useEffect, useState } from 'react';
import axiosClient from '../axios';
import Moment from 'moment';
import { userStateContext } from "../context/ContextProvider";

export default function CustomerInfo() {
    const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext();
    const [customerAccounts, setCustomerAccounts] = useState({});

    const user = JSON.parse(currentUser);

    useEffect(()=>{
        fetchCustomerAccounts();
    },[]);

    const fetchCustomerAccounts = async () => {
        await axiosClient.get('/getCustomerAccounts')
        .then((response) => {
            const accountsData = response.data.accounts;
            setCustomerAccounts(accountsData);
        }).catch((error)=>{
            console.error(error);
        })
    }
    
    return (
        <div className="mt-4">
            <div className="mb-5">
                <h1>Welcome back {user.name}!</h1>
            </div>
            <div className="fs-5">
                <p>
                    <span className="fw-bold">Account ID:</span> {user.id}
                </p>
            </div>
            <div className="fs-5">
                <p>
                    <span className="fw-bold">Full name:</span> {user.name}
                </p>
            </div>
            <div className="fs-5">
                <p>
                    <span className="fw-bold">Email address:</span> {user.email}
                </p>
            </div>
            <div className='mt-5'>
                <p className='fs-5 fw-bold'>Your accounts:</p>
            </div>
            <div className="table-responsive">
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>Account ID</th>
                            <th>Account number</th>
                            <th>Account country</th>
                            <th>Balance</th>
                            <th>Created at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(customerAccounts) ? customerAccounts.map((account) => {
                            return (
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.account_number}</td>
                                    <td>{account.account_country}</td>
                                    <td>{account.account_symbol} {account.balance}</td>
                                    <td>{Moment(account.created_at).format('MMMM Do, YYYY H:mma')}</td>
                                </tr>
                            )
                        }) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
