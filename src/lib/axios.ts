import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

axiosInstance.interceptors.response.use((res) => res,
async (error) =>{
    const originalReq = error.config;

    if(error.response && error.response.status === 401 && !originalReq._retry){
        originalReq._retry = true;

        try{

        }
        catch(refreshError){
            console.log("Refresh failed : ", refreshError)
            return Promise.reject(refreshError)
        }
    }

    return Promise.reject(error)
}
)