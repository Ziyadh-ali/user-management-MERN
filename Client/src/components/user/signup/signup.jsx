import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signup.css';
import axios from "../../../config/axios";
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewProfile, setPreviewProfile] = useState(null);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate()

    const validateForm = () => {
        let newErrors = {};

        if (!name.trim()) newErrors.name = "Full name is required.";
        else if (!/^[A-Za-z\s]+$/.test(name.trim()))
            newErrors.name = "Full name can only contain letters and spaces.";

        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Enter a valid email address.";

        if (!password.trim()) newErrors.password = "Password is required.";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";
        else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
            newErrors.password = "Password must contain at least 1 uppercase letter and 1 number.";

        if (!confirmPass)
            newErrors.confirmPass = "Confirm password required.";

        if (confirmPass !== password)
            newErrors.confirmPass = "Passwords do not match.";


        if (!profilePhoto)
            newErrors.profilePhoto = "Profile photo is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors({ ...errors, profilePhoto: "Only image files are allowed." });
                setProfilePhoto(null);
                setPreviewProfile(null);
                return;
            }
            setProfilePhoto(file);
            setPreviewProfile(URL.createObjectURL(file));
            setErrors({ ...errors, profilePhoto: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirmPass', confirmPass);
            formData.append('profilePhoto', profilePhoto);

            const response = await axios.post('/register', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response) {
                alert("Signup successful! Please log in.");
                navigate('/login')
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.response.data.message);
        }
    };

    return (
        <div className="sign-container">
            <div className="signup-container">
                <div className="signup-form">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                id="fullName"
                                name="fullName"
                            />
                            {errors.name && <span className="error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                id="email"
                                name="email"
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                name="password"
                            />
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPass">Confirm Password</label>
                            <input
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                type="password"
                                id="confirmPass"
                                name="confirmPass"
                            />
                            {errors.confirmPass && <span className="error">{errors.confirmPass}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="profilePhoto">Profile Photo</label>
                            <input
                                onChange={handleImageChange}
                                type="file"
                                id="profilePhoto"
                                name="profilePhoto"
                                accept="image/*"
                            />
                            {errors.profilePhoto && <span className="error">{errors.profilePhoto}</span>}
                        </div>

                        {profilePhoto && (
                            <div className="photo-preview">
                                <img id="photoPreview" src={previewProfile} alt="Preview" />
                            </div>
                        )}

                        <button type="submit" className="signup-button">
                            Sign Up
                        </button>
                    </form>

                    <div className="links">
                        <Link to="/login" className="login-link">Already have an account? Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
