import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../redux/userSlice'
import "./Home.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Home() {
    const user = useSelector((state) => state.userSlice.users);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    function handleLogout() {
        dispatch(logout())
        toast.success("Logout successfull");
        navigate('/login')
    }
    return (
        <>
            <div className="home-container">
                <div className="user-home-container">
                    <header className="user-home-header">
                        <h1>Welcome, {user.name}</h1>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </header>
                    <main className="user-home-main">
                        <div className="user-profile">
                            <div className="profile-photo">
                                <img src={user.profilePhoto || "/placeholder.svg"} alt={`${user.name}'s profile`} />
                            </div>
                            <div className="user-details">
                                <h2>User Details</h2>
                                <p>
                                    <strong>Name:</strong> {user.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                            </div>
                            <button onClick={()=>navigate("/edit-profile")} className="edit-button">Edit Profile</button>
                        </div>
                    </main>
                    <footer className="user-home-footer">
                        <p>&copy; 2023 Our Service. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default Home