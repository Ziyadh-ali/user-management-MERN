import express  from"express";

const user_route = express();
import {
    login,
    editUser,
    newAccessToken,
    register
} from "../controllers/userController.js"
import upload from "../config/multer.js";
import authenticate_token from "../middlewares/token-Auth.js";

user_route.post('/register',upload.single('profilePhoto'),register);
user_route.post('/login',login);
user_route.post('/edit-user',upload.single('profilePhoto'),authenticate_token,editUser);


user_route.post('/token',newAccessToken);

export default user_route 