import express  from"express";

const admin_route = express();
import {
    signup,
    login,
    getAllUser,
    addUser,
    removeUser,
    userDetails,
    editUser,
    newAccessToken, 
} from "../controllers/adminController.js"
import authenticate_admin_token from "../middlewares/admin-token-auth.js";
import upload from "../config/multer.js";

admin_route.post('/signup',signup);
admin_route.post('/login',login);
admin_route.get('/get-users',authenticate_admin_token,getAllUser);
admin_route.post('/add-user',authenticate_admin_token,upload.single("profilePhoto"),addUser);
admin_route.delete('/delete-user/:id',authenticate_admin_token,removeUser);
admin_route.get('/get-user/:id',authenticate_admin_token ,userDetails);
admin_route.post('/edit-user',authenticate_admin_token,upload.single("profilePhoto"),editUser);
admin_route.post('/token',newAccessToken);


export default admin_route 