import express from "express";
import  DataBase from "./config/dbConfig.js"
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//////////////////////
DataBase();
//////////////////////
const app = express();
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
}));
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//////////////////////
import userRoute from "./routes/userRoute.js"
app.use('/',userRoute);

app.listen('3000',()=>{
    console.log('server runnning successfully');
})