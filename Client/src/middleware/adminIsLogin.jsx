import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const IsAdminLogin = () => {
    const admin = useSelector((state)=> state.adminSlice.admin);

    return admin ? <Outlet/> : <Navigate to= "/admin/login" replace/>
}

export default IsAdminLogin