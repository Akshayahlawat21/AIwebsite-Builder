import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// Helper to get auth headers - uses localStorage token as fallback for cross-domain cookies
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

function useGetCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Try fetching existing session (cookie or localStorage token)
                    const result = await axios.get(
                        `${serverUrl}/api/user/me`,
                        {
                            withCredentials: true,
                            headers: getAuthHeaders()
                        }
                    );

                    if (result.data && result.data._id) {
                        dispatch(setUserData(result.data));
                    } else {
                        throw new Error("No valid user in response");
                    }
                } catch (error) {
                    // No session found - create new session via Google auth
                    try {
                        console.log("Creating new session...");
                        const { data } = await axios.post(
                            `${serverUrl}/api/auth/google`,
                            {
                                name: firebaseUser.displayName,
                                email: firebaseUser.email,
                                avatar: firebaseUser.photoURL,
                            },
                            { withCredentials: true }
                        );
                        // Store token in localStorage as cross-domain cookie fallback
                        if (data.token) {
                            localStorage.setItem("token", data.token);
                        }
                        dispatch(setUserData(data));
                    } catch (innerError) {
                        console.error("Auth failed completely:", innerError);
                        dispatch(setUserData(null));
                    }
                }
            } else {
                localStorage.removeItem("token");
                dispatch(setUserData(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
}

export default useGetCurrentUser;