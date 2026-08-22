import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { useDashboardStore } from "./useDashStore";

interface SignupData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface User {
    userId: string;
    name: string;
    email: string;
}

interface AuthState {
    authUser: User | null;

    isSignUp: boolean;
    isLogginIn: boolean;
    isCheckingAuth: boolean;

    checkAuth: () => Promise<void>;

    signup: (
        data: SignupData
    ) => Promise<void>;

    login: (
        data: LoginData
    ) => Promise<void>;

    logOut: () => Promise<void>;

    googleAuth: () => Promise<void>;

    init: () => Promise<void>;
}


// ============================================================
// NORMALIZE BACKEND USER
// ============================================================

const normalizeUser = (user: any): User => ({
    userId: user.userid,
    name: user.name,
    email: user.email,
});


export const useAuthStore = create<AuthState>(
    (set, get) => ({

        authUser: null,

        isSignUp: false,
        isLogginIn: false,
        isCheckingAuth: true,


        // ====================================================
        // CHECK AUTH
        // ====================================================

        checkAuth: async () => {

            try {

                const response =
                    await axiosInstance.get(
                        "/auth/checkAuth"
                    );

                const user =
                    response.data.user;

                set({
                    authUser:
                        normalizeUser(user),
                });

            } catch (error) {

                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 401
                ) {

                    try {

                        // Access token expired
                        // → refresh it

                        await axiosInstance.post(
                            "/auth/refresh"
                        );


                        // Check auth again

                        const response =
                            await axiosInstance.get(
                                "/auth/checkAuth"
                            );


                        set({
                            authUser:
                                normalizeUser(
                                    response.data.user
                                ),
                        });

                    } catch (refreshError) {

                        set({
                            authUser: null,
                        });

                        console.log(
                            "Authentication failed:",
                            refreshError
                        );

                    }

                } else {

                    set({
                        authUser: null,
                    });

                    console.log(
                        "Check auth failed:",
                        error
                    );
                }

            } finally {

                set({
                    isCheckingAuth: false,
                });

            }
        },


        // ====================================================
        // SIGNUP
        // ====================================================

        signup: async (
            data: SignupData
        ) => {

            set({
                isSignUp: true,
            });

            try {

                const response =
                    await axiosInstance.post(
                        "/auth/signup",
                        data
                    );


                set({
                    authUser:
                        normalizeUser(
                            response.data.user
                        ),
                });


                toast.success(
                    "Signup successful ✅"
                );

            } catch (error) {

                set({
                    authUser: null,
                });

                if (
                    axios.isAxiosError(error)
                ) {

                    toast.error(
                        error.response?.data.msg ||
                        "Signup failed"
                    );

                } else {

                    toast.error(
                        "Signup failed"
                    );
                }

                console.log(
                    "Something went wrong:",
                    error
                );

            } finally {

                set({
                    isSignUp: false,
                });

            }
        },


        // ====================================================
        // LOGIN
        // ====================================================

        login: async (
            data: LoginData
        ) => {

            set({
                isLogginIn: true,
            });

            try {

                const response =
                    await axiosInstance.post(
                        "/auth/login",
                        data
                    );


                set({
                    authUser:
                        normalizeUser(
                            response.data.user
                        ),
                });


                toast.success(
                    "Login successful ✅"
                );

            } catch (error) {

                set({
                    authUser: null,
                });

                if (
                    axios.isAxiosError(error)
                ) {

                    toast.error(
                        error.response?.data.msg ||
                        "Login failed"
                    );

                } else {

                    toast.error(
                        "Login failed"
                    );
                }

                console.log(
                    "Something went wrong:",
                    error
                );

            } finally {

                set({
                    isLogginIn: false,
                });

            }
        },


        // ====================================================
        // LOGOUT
        // ====================================================

    logOut: async () => {

    // Immediately remove old user's dashboard state
        useDashboardStore
        .getState()
        .clearDashboard();

    try {

        await axiosInstance.post(
            "/auth/logout"
        );

        set({
            authUser: null,
        });

        toast.success(
            "Logout successful ✅"
        );

    } catch (error) {

        /*
         * Dashboard state is already cleared.
         * This prevents the previous user's
         * organization from leaking into the
         * next session.
         */

        if (axios.isAxiosError(error)) {

            toast.error(
                error.response?.data?.msg ||
                "Logout failed"
            );

        } else {

            toast.error(
                "Logout failed"
            );
        }

        console.error(
            "Logout failed:",
            error
        );
    }
    },

        // ====================================================
        // GOOGLE AUTH
        // ====================================================

        googleAuth: async () => {

            try {

                window.open(
                    `${import.meta.env.VITE_BASE_URL}/auth/google`,
                    "_self"
                );

            } catch (error) {

                if (
                    axios.isAxiosError(error)
                ) {

                    toast.error(
                        error.response?.data.msg ||
                        "Google Auth failed"
                    );

                } else {

                    toast.error(
                        "Google Auth failed"
                    );
                }

                console.log(
                    "Something went wrong:",
                    error
                );
            }
        },


        // ====================================================
        // INIT
        // ====================================================

        init: async () => {

            await get().checkAuth();

        },

    })
);