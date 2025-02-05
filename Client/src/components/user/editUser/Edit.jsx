import React, { useState } from "react";
import "./Edit.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../../config/axios";
import { addUser } from "../../../redux/userSlice";


function Edit() {
    const user = useSelector((state) => state.userSlice.users);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewProfile, setPreviewProfile] = useState(user.profilePhoto);

    // Validation state
    const [errors, setErrors] = useState({
        name: "",
        password: "",
        confirmPass: "",
        profilePhoto: "",
    });

    function handleImageChange(e) {
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

        // Validate Name (Only letters and spaces)
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
            if (password) formData.append("password", password);
            if (profilePhoto) formData.append("profilePhoto", profilePhoto);

            const response = await axios.post("/edit-user", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response) {
                alert(response?.data?.message);
                dispatch(addUser(response.data.user));
                navigate("/");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <>
            <div className="edit-container">
                <div className="edit-profile-container">
                    <header className="edit-profile-header">
                        <h1>Edit Profile</h1>
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

                            <button type="submit" className="save-button">
                                Save Changes
                            </button>
                            <button type="button" onClick={() => navigate("/")} className="cancel-button">
                                Cancel
                            </button>
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

export default Edit;
