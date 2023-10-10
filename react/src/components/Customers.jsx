import React, { useEffect, useState } from 'react';
import axiosClient from '../axios';
import Moment from 'moment';

export default function Customers() {
    const [allUsers, setAllUsers] = useState({});
    const [countries, setCountries] = useState({});
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [refresh, setRefresh] = useState(false);
    
    useEffect(()=>{
        fetchUsers();
    },[refresh]);

    const fetchUsers = async () => {
        await axiosClient.get('/getUsers')
        .then((response) => {
            const usersData = response.data.data;
            setAllUsers(usersData);
        }).catch((error)=>{
            console.error(error);
        })

    }

    const handleCreateUSer = (e) => {
        e.preventDefault();
        setRefresh(true);
        setError({ __html: "" });

        axiosClient
            .post("/AdminCreateUser", {
                name: fullName,
                email: email,
                password: password
            })
            .then(({ data }) => {
                alert('Customer account created successfully');
                setRefresh(false);
            })
            .catch((error) => {
                if(error.response) {
                    const formErrors = Object.values(error.response.data.errors).reduce((accum, next) => 
                    [...next, ...accum] ,[]);

                    setError({__html: formErrors.join('<br>')})
                } else {
                    console.error(error);
                }
            });

    }
    
  return (
    <div className='mt-4'>
        <div className='my-3'>
            <p className='fs-3 fw-bold'>Create a new customer</p>
            {error.__html && (<div className="text-danger mb-3" dangerouslySetInnerHTML={error}></div>)}
            <form action="#" method='POST' onSubmit={(e) => handleCreateUSer(e)}>
                <div className="row">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="form-group">
                            <label htmlFor="customerFullName" className="form-label">Customer Full name</label>
                            <input placeholder='Enter customer full name' value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" name='customerFullName' className="form-control" required/>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="form-group">
                            <label htmlFor="customerEmail" className="form-label">Customer email</label>
                            <input placeholder='Enter customer email' value={email} onChange={(e) => setEmail(e.target.value)} type="email" name='customerEmail' className="form-control" required/>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="form-group">
                            <label htmlFor="customerPassword" className="form-label">Customer Password</label>
                            <input placeholder='Enter customer account password' value={password} onChange={(e) => setPassword(e.target.value)} type="password" name='customerPassword' className="form-control" required/>
                        </div>
                    </div>
                    <div className="col-md-12 mt-4 mb-4 mb-md-0">
                        <div className="text-start">
                            <button className='btn btn-primary' type="submit">Create</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div className="table-responsive mt-5">
            <table className='table table-striped table-hover'>
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Customer name</th>
                        <th>Customer email</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(allUsers) ? allUsers.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{Moment(user.created_at).format('MMMM Do, YYYY H:mma')}</td>
                                </tr>
                            )
                        }) : null
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}
