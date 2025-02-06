import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const IsAdminLogout = () => {
    const admin = useSelector((state)=> state.adminSlice.admin);

    return admin ? <Navigate to= "/admin/home" replace/> : <Outlet/>
}

export default IsAdminLogout