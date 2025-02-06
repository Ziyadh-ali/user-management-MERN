import axios from "axios";
const admininstance = axios.create({
    baseURL: 'http://localhost:3000/admin',
});

admininstance.interceptors.request.use(async (config) => {
    const access_token = localStorage.getItem('adminToken');
    if (access_token) {
        config.headers["Authorization"] = `Bearer ${access_token}`
    }
    return config;
});

admininstance.interceptors.response.use(
    (response) => {
        if (response?.data?.token) {
            localStorage.setItem('adminToken', response.data.token);
        }
        return response;
    },

    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status == 403 &&
            error.response?.data?.message == "Forbidden - Token expired" &&
            !originalRequest._retry
        ) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRefresh");
            localStorage.removeItem("admin")
            window.location.href = "/admin/login"

            return Promise.reject(error); 
        }
        // else if (
        //     error.response?.status == 403 &&
        //     error.response?.data?.message == "Forbidden - Invalid refresh token" &&
        //     !originalRequest._retry
        // ) {
            
        //     localStorage.removeItem("adminToken");
        //     localStorage.removeItem("adminRefresh");
        //     localStorage.removeItem("admin")
        //     window.location.href = "/admin/login"

        //     return Promise.reject(error);
        // }

        if (
            error.response?.status === 401 &&
            error.response?.data?.message == "Forbidden - Invalid or expired token" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true
            try {
                const refreshToken = localStorage.getItem('adminRefresh')
                const response = await admininstance.post('/token', {
                    rToken :  refreshToken
                });

                admininstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response?.data?.token}`;

                return admininstance(originalRequest);
            } catch (error) {
                console.log("Error refreshing token:", error);
                return Promise.reject(error);
            }
        }else if (
            error.response?.status === 401 &&
            error.response?.data?.message == "Unauthorized - No token provided" &&
            !originalRequest._retry
        ){
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRefresh");
            localStorage.removeItem("admin")
            window.location.href = "/admin/login"

            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
)

export default admininstance