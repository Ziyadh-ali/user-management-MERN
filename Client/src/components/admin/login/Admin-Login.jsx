import { useState } from "react"
import "./admin-login.css"
import axios from "../../../config/adminAxios"
import { useNavigate } from "react-router-dom";
import {addAdmin} from "../../../redux/adminSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AdminLoginPage() {
    const [email , setEmail ] = useState("")
    const [password , setPassword ] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try {
            const response = await axios.post('/login',{email , password});
            if(response){
                localStorage.setItem("adminToken",response.data.adminToken)
                localStorage.setItem("adminRefresh",response.data.adminRefresh)
                dispatch(addAdmin(response.data.admin.email))
                toast.success(response?.data?.message);
                navigate("/admin/home")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="admin-login">
            <div className="admin-login-container">
                <div className="admin-login-form">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" id="username" name="username" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" id="password" name="password" />
                        </div>
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                    <div className="admin-links">
                        <a href="#" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLoginPage

