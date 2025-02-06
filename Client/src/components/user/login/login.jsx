import { useState } from "react"
import "./login.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "../../../config/axios"
import { addUser } from "../../../redux/userSlice"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/login", { email, password })
            if (response) {
                let user = response.data.userData
                const token = response.data.token;
                const refreshToken = response.data.refreshToken;
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                dispatch(addUser(user))
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className="container">
            <div className="login-container">
                <div className="login-form">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" required />
                        </div>
                        <button type="submit" className="login-button">
                            Sign In
                        </button>
                    </form>
                    <div className="links">
                        <Link to={'/signup'} className="sign-up">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage

