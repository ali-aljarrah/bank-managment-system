import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Moment from 'moment';
import DataTable from "react-data-table-component";

export default function CustomerTransferHistory() {
    const [customerTransactions, setCustomerTransactions] = useState({});
    const [page, setPage] = useState(1);
    const countPerPage = 5;

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            id: 'Transaction ID',
            sortable: true,
            style: {
              maxWidth: '130px'
          }
        },
        {
            name: "From account",
            selector: (row) => row.account_from,
            sortable: true,
        },
        {
            name: "To account",
            selector: (row) => row.account_from,
            sortable: true,
        },
        {
            name: "To email",
            selector: (row) => row.customer_email_to,
            sortable: true,
        },
        {
            name: "To account",
            selector: (row) => row.account_to,
            sortable: true,
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
            sortable: true,
        },
        {
            name: "Created at",
            selector: (row) => Moment(row.created_at).format("MMMM Do, YYYY H:mma"),
            sortable: true,
        },
    ];

    useEffect(() => {
        fetechCustomerTransactions();  
    },[page]);

    const fetechCustomerTransactions = () => {
        axiosClient.get(`/getCustomerTransactions?page=${page}&per_page=${countPerPage}&delay=1`)
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
                    <DataTable
                        columns={columns}
                        data={customerTransactions.data}
                        pagination
                        paginationServer
                        paginationTotalRows={customerTransactions.total}
                        paginationPerPage={countPerPage}
                        paginationComponentOptions={{
                            noRowsPerPage: true,
                        }}
                        onChangePage={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}
