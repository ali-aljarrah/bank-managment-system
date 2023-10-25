import React, { useEffect, useState } from 'react';
import axiosClient from '../axios';
import Moment from 'moment';
import { userStateContext } from "../context/ContextProvider";
import DataTable from 'react-data-table-component';

export default function CustomerInfo() {
    const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext();
    const [customerAccounts, setCustomerAccounts] = useState({});
    const [page, setPage] = useState(1);
    const countPerPage = 5;

    const user = JSON.parse(currentUser);

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
            name: 'Balance',
            selector: row => row.account_symbol + " " + row.balance,
            sortable: true
        },
        {
            name: 'Created at',
            selector: row => Moment(row.created_at).format("MMMM Do, YYYY H:mma"),
            sortable: true
        },
    ];

    useEffect(()=>{
        fetchCustomerAccounts();
    },[page]);

    const fetchCustomerAccounts = () => {
        axiosClient.get(`/getCustomerAccounts?page=${page}&per_page=${countPerPage}&delay=1`)
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
            <div className="table-responsive mt-5">
                <DataTable 
                    title="Your accounts"
                    columns={columns} 
                    data={customerAccounts.data} 
                    pagination 
                    paginationServer
                    paginationTotalRows={customerAccounts.total}
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
