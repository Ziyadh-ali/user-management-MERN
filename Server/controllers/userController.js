import dotenv from "dotenv"
dotenv.config();
import User from "../model/userModel.js"
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

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPass } = req.body;
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
                console.log("saved")
                res.status(201).json({
                    message: "User registered successfully",
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not found! Please Signup" });
        }
        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) {
            res.status(401).json({ message: "Incorrect Password" })
        }
        const userData = {
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
        }

        const token = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "30m" });
        res.status(200).json({
            userData,
            token,
            refreshToken,
            message: "Login Successfull"
        })
    } catch (error) {
        console.log("errrorororoor", error);
    }
}

const editUser = async (req, res) => {
    try {
        console.log("i am in edit ")
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
                { id: user.id, email: user.email },
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
    register,
    login,
    newAccessToken,
    editUser
}