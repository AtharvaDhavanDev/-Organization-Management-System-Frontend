import {axiosInstance} from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

interface SignupData {
    name : string,
    email : string,
    password : string
}

interface LoginData {
    email : string,
    password : string
}

interface User {
    userId : string,
    name : string,
    email : string
}

interface AuthState {
    authUser : User | null;
    isSignUp : boolean;
    isLogginIn : boolean;
    isCheckingAuth : boolean;
    
    checkAuth : () => Promise<void>;
    signup : (data : SignupData) => Promise<void>;
    login : (data : LoginData) => Promise<void>;
    logOut : () => Promise<void>;
    googleAuth : () => Promise<void>;
    init : () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set , get) => ({
    authUser : null,
    isSignUp : false,
    isLogginIn : false,
    isCheckingAuth : true,

    checkAuth: async () => {
    try {
        const response = await axiosInstance.get("/auth/checkAuth");

        set({
            authUser: response.data.user
        });

    } catch (error) {

        if (axios.isAxiosError(error) && error.response?.status === 401) {

            try {
                // Access token expired → try refreshing it
                await axiosInstance.post("/auth/refresh");

                // Check authentication again with the new access token
                const response = await axiosInstance.get("/auth/checkAuth");

                set({
                    authUser: response.data.user
                });

            } catch (refreshError) {
                // Refresh token is also invalid/expired
                set({
                    authUser: null
                });

                console.log("Authentication failed:", refreshError);
            }

        } else {
            // Some other error occurred
            set({
                authUser: null
            });

            console.log("Check auth failed:", error);
        }
    } finally {
        set({
            isCheckingAuth: false
        });
    }
    },

    signup : async (data : SignupData) => {

        set({isSignUp : true})

        try{
            const response = await axiosInstance.post("/auth/signup" , data);
            set({authUser : response.data.user});
            toast.success("Signup successful ✅");
        }
        catch(error){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.msg || "Signup failed");
            }else{
                toast.error("Signup failed");
            }
            set({authUser : null})
            console.log("Something went wrong : " , error)
        }finally{
            set({isSignUp : false})
        }
    },

    login : async (data : LoginData) => {

        set({isLogginIn : true})

        try{
            const response = await axiosInstance.post("/auth/login" , data);
            set({authUser : response.data.user});
            toast.success("Login successful ✅");
        }
        catch(error){
            set({authUser : null})

            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.msg || "Login failed");
            }else{
                toast.error("Login failed");
            }
            console.log("Something went wrong : " , error)
        }finally{
            set({isLogginIn : false})
        }
    },

    logOut : async() => {
        try{
            await axiosInstance.post('/auth/logout')
            set({authUser : null})
            toast.success("Logout successful ✅")
        }
        catch(error){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.msg || "Logout failed");
            }else{
                toast.error("Logout failed");
            }
            console.log("Something went wrong : " , error)
        }
    },

    googleAuth : async() => {
        try{
            window.open(`${import.meta.env.VITE_BASE_URL}/auth/google` , "_self")
        }
        catch(error){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.msg || "Google Auth failed");
            }else{
                toast.error("Google Auth failed");
            }
            console.log("Something went wrong : " , error)
        }
    },

    init : async() => {
        try{
            await axiosInstance.post('/auth/refresh')
        }
        catch(error){
            console.log("No refresh token found : ", error)
        }

        await get().checkAuth()
    }

}))