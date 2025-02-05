import { createSlice } from "@reduxjs/toolkit";

const userSlice =  createSlice({
    name : "users",
    initialState : {
        users : JSON.parse(localStorage.getItem('user')) || null
    },
    reducers : {
        addUser : (state , action)=>{
            state.users = action.payload;
            localStorage.setItem('user',JSON.stringify(action.payload));
        },
        logout : (state)=>{
            state.users = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }
})

export const {addUser , logout} =  userSlice.actions
export default userSlice.reducer