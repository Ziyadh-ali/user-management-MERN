import React, { useEffect, useState } from "react";
import "./Admin-Home.css";
import axios from "../../../config/adminAxios";
import { logout, addAdmin } from "../../../redux/adminSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const AdminHome = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUser] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/get-users")
                setUsers(response.data.users);
                setFilteredUser(response.data.users);
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, []);

    const handleRemoveUser = async (id) => {
        try {
            const response = await axios.delete(`/delete-user/${id}`);
            toast.success("User removed")
            setUsers(response.data.users);
            setFilteredUser(response.data.users);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    };
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase()
        if (value === "") {
            setFilteredUser(users)
        } else {
            setFilteredUser(
                users.filter((item) => {
                    return (
                        item.name.toLowerCase().includes(value) ||
                        item.email.toLowerCase().includes(value)
                    )
                })
            )
        }
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1 className="admin-title">Admin Dashboard</h1>
                <button className="admin-logout-btn" onClick={() => dispatch(logout())}>
                    Logout
                </button>
            </header>
            <main className="admin-main">
                <div className="admin-user-list-header">
                    <h2 className="admin-user-list-title">User List</h2>
                    <input onChange={handleSearch} type="text" />
                    <button className="admin-add-user-btn" onClick={() => navigate("/admin/add-user")}>
                        Add User
                    </button>
                </div>
                <ul className="admin-user-list">
                    {filteredUsers.map((user) => (
                        <li key={user._id} className="admin-user-item">
                            <div className="admin-user-info">
                                <img src={user.profilePhoto || "/placeholder.svg"} alt={user.name} className="admin-user-avatar" />
                                <span className="admin-user-details">
                                    <span className="admin-user-name">{user.name}</span>
                                    <span className="admin-user-email">{user.email}</span>
                                </span>
                            </div>
                            <div className="admin-user-actions">
                                <button className="admin-edit-user-btn" onClick={() => navigate(`/admin/edit-user/${user._id}`)}>
                                    Edit
                                </button>
                                <button className="admin-remove-user-btn" onClick={() => handleRemoveUser(user._id)}>
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default AdminHome;
