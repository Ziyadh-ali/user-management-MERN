import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const IsLogout = () => {
    const user = useSelector((state)=> state.userSlice.users);

    return user ?<Navigate to= "/" replace/> : <Outlet/>
}

export default IsLogout