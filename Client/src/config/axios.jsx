import axios from "axios";
const instance = axios.create({
    baseURL: 'http://localhost:3000',
});

instance.interceptors.request.use(async (config) => {
    const access_token = localStorage.getItem('accessToken');
    if (access_token) {
        config.headers["Authorization"] = `Bearer ${access_token}`
    }
    return config;
});

instance.interceptors.response.use(
    (response) => {
        if (response?.data?.token) {
            localStorage.setItem('accessToken', response.data.token);
        }
        return response;
    },

    async (error) => {
        const originalRequest = error.config;
        console.log("OG REQUEST ",originalRequest); 
        if (
            error.response?.status == 403 &&
            error.response?.data?.message == "Forbidden - Token expired" &&
            !originalRequest._retry
        ) {
            
            console.log("remove PLace")
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user")
            window.location.href = "/login"

            return Promise.reject(error);
        }
        // else if (
        //     error.response?.status == 403 &&
        //     error.response?.data?.message == "Forbidden - Invalid refresh token" &&
        //     !originalRequest._retry
        // ) {
            
        //     console.log("remove PLace")
        //     localStorage.removeItem("refreshToken");
        //     localStorage.removeItem("accessToken");
        //     localStorage.removeItem("user")
        //     window.location.href = "/login"

        //     return Promise.reject(error);
        // }

        if (
            error.response?.status === 401 &&
            error.response?.data?.message == "Forbidden - Invalid or expired token" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true
            try {
                const refreshToken = localStorage.getItem('refreshToken')
                
                const response = await instance.post('/token', {
                    rToken :  refreshToken
                });

                instance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response?.data?.token}`;

                return instance(originalRequest);
            } catch (error) {
                console.log("Error refreshing token:", error);
                return Promise.reject(error);
            }
        }else if (
            error.response?.status === 401 &&
            error.response?.data?.message == "Unauthorized - No token provided" &&
            !originalRequest._retry
        ){
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user")
            window.location.href = "/login"

            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
)

export default instance