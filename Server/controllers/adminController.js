import dotenv from "dotenv"
dotenv.config();
import User from "../model/userModel.js"
import Admin from "../model/adminModel.js"
import bcrypt from "bcrypt"
import cloudinary from "../config/cloudinary.js"
import jwt from "jsonwebtoken"


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.meesage)
    }
}

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await securePassword(password);
        const admin = new Admin({
            email: email,
            password: hashedPassword
        })
        await admin.save();
        res.status(200).json({ message: "success" })
    } catch (error) {
        console.log(error);

    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        const comparePass = await bcrypt.compare(password, admin.password);
        if (!comparePass) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        const adminToken = jwt.sign({ id: admin._id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
        const adminRefresh = jwt.sign({ id: admin._id }, process.env.REFRESH_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ message: "login successfull", admin, adminToken, adminRefresh })
    } catch (error) {
        console.log(error);
    }
}

const getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "users comes", users });
    } catch (error) {
        console.log(error);
    }
}

const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const profilePhoto = req.file;
        
        const user = await User.findOne({ email });

        if (user) {
            return res.status(401).json({
                message: "User Already Exists",
                success: false,
            })
        }

        if (!profilePhoto) {
            return res.status(401).json({
                message: "Profile Photo is required",
                success: false,
            })
        }

        const hashedPassword = await securePassword(password);
        cloudinary.uploader.upload(profilePhoto.path, {
            folder: 'profile_photos'
        })
            .then(async (result) => {
                const profilePhotoUrl = result.secure_url;
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    profilePhoto: profilePhotoUrl,
                })
                await newUser.save();
                console.log(newUser)
                res.status(201).json({
                    message: "User added",
                    success: true
                });
            })
            .catch((error) => {
                console.log(error);
            })
    } catch (error) {
        console.log(error);
    }
}

const editUser = async (req, res) => {
    try {
        const { name , id } = req.body;
        const profilePhoto = req.file ? req.file : null;
        const user = await User.findById(id);   

        user.name = name;
        if (profilePhoto) {
            cloudinary.uploader.upload(profilePhoto.path, {
                folder: 'profile_photos'
            })
                .then(async (result) => {
                    const profilePhotoUrl = result.secure_url;
                    user.profilePhoto = profilePhotoUrl
                    user.save();
                    return res.status(201).json({
                        message: "User updated successfully",
                        user
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            user.save();
            return res.status(200).json({ message: "User updated successfully", user });
        }
    } catch (error) {
        console.log(error);
    }
}

const userDetails = async (req,res)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json({user})
    } catch (error) {
        console.log(error);
    }
}

const removeUser = async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        const users = await User.find();
        res.status(200).json({ users, message: "User deleted" });
    } catch (error) {
        console.log(error);
    }
}

const newAccessToken = (req, res) => {
    try {
        const { rToken } = req.body;

        if (!rToken) {
            return res.status(403).json({ message: "Forbidden - Invalid refresh token" });
        }
        jwt.verify(rToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden - Token expired" });
            }

            const newAccessToken = jwt.sign(
                { id: user.id},
                process.env.ACCESS_SECRET,
                { expiresIn: "15m" }
            );

            res.json({ token: newAccessToken, rToken });
        });
    } catch (error) {
        console.log(error)
    }
};

export {
    signup,
    login,
    getAllUser,
    addUser,
    removeUser,
    userDetails,
    editUser,
    newAccessToken
}
