import React, { useEffect, useState } from "react";
import axiosClient from "../axios";
import Moment from "moment";
import DataTable from "react-data-table-component";

export default function AdminTransactionHistory() {
    const [transactions, setTransactions] = useState({});
    const [page, setPage] = useState(1);
    const countPerPage = 5;

    const columns = [
        {
            name: "Transaction ID",
            selector: (row) => row.id,
            id: 'Transaction ID',
            sortable: true,
            style: {
              maxWidth: '130px'
          }
        },
        {
            name: "From email",
            selector: (row) => row.customer_email_from,
            sortable: true,
        },
        {
            name: "From number",
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
            name: "Transfared amount",
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
        fetchTransactions();
    }, [page]);

    const fetchTransactions = () => {
        axiosClient
            .get(
                `/getTransactions?page=${page}&per_page=${countPerPage}&delay=1`
            )
            .then((response) => {
                const transactionsData = response.data.data;
                setTransactions(transactionsData);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="mt-4">
            <p className="fs-3 fw-bold">Customers transactions</p>
            <div className="table-responsive mt-5">
                <DataTable
                    columns={columns}
                    data={transactions.data}
                    pagination
                    paginationServer
                    paginationTotalRows={transactions.total}
                    paginationPerPage={countPerPage}
                    paginationComponentOptions={{
                        noRowsPerPage: true,
                    }}
                    onChangePage={(page) => setPage(page)}
                />
            </div>
        </div>
    );
}
