import mongoose from "mongoose";
const adminSchema=mongoose.Schema({
 
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        
    },
  

});

export default mongoose.model('Admin',adminSchema); 