import { createSlice } from "@reduxjs/toolkit";

const adminSlice =  createSlice({
    name : "admin",
    initialState : {
        admin : localStorage.getItem('admin') || null
    },
    reducers : {
        addAdmin : (state , action)=>{
            state.admin = action.payload;
            localStorage.setItem('admin',action.payload);
        },
        logout : (state)=>{
            state.admin = null;
            localStorage.removeItem('admin');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adiminRefresh');
        }
    }
})

export const {addAdmin , logout} =  adminSlice.actions
export default adminSlice.reducer