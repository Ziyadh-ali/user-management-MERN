import mongoose from "mongoose";
const adminSchema=mongoose.Schema({
 
    email:{
        type:String,
    },

    password:{
        type:String,
    },
  

});

export default mongoose.model('Admin',adminSchema); 