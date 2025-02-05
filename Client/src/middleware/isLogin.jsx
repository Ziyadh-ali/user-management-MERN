import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const IsLogin = () => {
    const user = useSelector((state)=> state.userSlice.users);

    return user ? <Outlet/> : <Navigate to= "/login" replace/>
}

export default IsLogin