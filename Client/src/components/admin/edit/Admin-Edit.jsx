import React, { useEffect, useState } from 'react'
import "./Admin-Edit.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "../../../config/adminAxios"
import { toast } from 'react-toastify';

const AdminEdit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewProfile, setPreviewProfile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await axios.get(`/get-user/${id}`);
            const user = response.data.user;
            setName(user.name);
            setEmail(user.email);
            setPreviewProfile(user.profilePhoto);
        }
        fetchDetails();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewProfile(URL.createObjectURL(file));
            setProfilePhoto(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let valid = true;
        let newErrors = { name: "", password: "", confirmPass: "", profilePhoto: "" };

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!name.trim()) {
            newErrors.name = "Name is required.";
            valid = false;
        } else if (!nameRegex.test(name.trim())) {
            newErrors.name = "Name can only contain letters and spaces.";
            valid = false;
        }
        if (profilePhoto) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

            if (!validImageTypes.includes(profilePhoto.type)) {
                newErrors.profilePhoto = "Only JPG, JPEG, PNG, and GIF files are allowed.";
                valid = false;
            }
        }

        // Validate Password
        if (password && password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
            valid = false;
        }

        if (password && !confirmPass) {
            newErrors.confirmPass = "Please confirm your new password.";
            valid = false;
        }

        if (password && password !== confirmPass) {
            newErrors.confirmPass = "New password and confirm password do not match.";
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("id", id);
            if (password) formData.append("password", password);
            if (password) formData.append("password", password);
            if (profilePhoto) formData.append("profilePhoto", profilePhoto);
            
            const response = await axios.post("/edit-user", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response) {
                toast.success(response?.data?.message);
                navigate("/admin/home");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error editing user")
        }
    }

    return (
        <>
            <div className="edit-container">
                <div className="edit-profile-container">
                    <header className="edit-profile-header">
                        <h1>Edit User</h1>
                    </header>
                    <main className="edit-profile-main">
                        <form onSubmit={handleSubmit} className="edit-profile-form">
                            <div className="profile-photo-edit">
                                <img src={previewProfile || "/placeholder.svg"} alt="Profile preview" />
                                <input
                                    onChange={handleImageChange}
                                    type="file"
                                    id="profile-photo-input"
                                    accept="image/*"
                                />
                                <label htmlFor="profile-photo-input" className="photo-upload-button">
                                    Change Photo
                                </label>
                                {errors.profilePhoto && <p className="error">{errors.profilePhoto}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                />
                                {errors.name && <p className="error">{errors.name}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input disabled type="email" id="email" name="email" value={email} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">New Password (leave blank to keep current)</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    id="password"
                                    name="password"
                                />
                                {errors.password && <p className="error">{errors.password}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm New Password</label>
                                <input
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    type="password"
                                    id="confirm-password"
                                    name="confirm-password"
                                />
                                {errors.confirmPass && <p className="error">{errors.confirmPass}</p>}
                            </div>

                            <div>
                                <button type="submit" className="save-button">
                                    Save Changes
                                </button>
                                <button type="button" onClick={() => navigate("/admin/home")} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </main>
                    <footer className="edit-profile-footer">
                        <p>&copy; 2023 Our Service. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default AdminEdit