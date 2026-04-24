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
        console.log("useGetCurrentUser: Subscribing to onAuthStateChanged...");
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("useGetCurrentUser: Firebase Auth State Changed. User:", firebaseUser ? firebaseUser.email : "NULL");
            if (firebaseUser) {
                try {
                    console.log("useGetCurrentUser: Attempting to fetch session from:", `${serverUrl}/api/user/me`);
                    const result = await axios.get(
                        `${serverUrl}/api/user/me`,
                        {
                            withCredentials: true,
                            headers: getAuthHeaders()
                        }
                    );

                    if (result.data && result.data._id) {
                        console.log("useGetCurrentUser: Session valid. User loaded:", result.data.email);
                        dispatch(setUserData(result.data));
                    } else {
                        console.log("useGetCurrentUser: Session response invalid. Data:", result.data);
                        throw new Error("No valid user in response");
                    }
                } catch (error) {
                    console.log("useGetCurrentUser: Session fetch failed. Attempting to create new session...");
                    try {
                        const { data } = await axios.post(
                            `${serverUrl}/api/auth/google`,
                            {
                                name: firebaseUser.displayName,
                                email: firebaseUser.email,
                                avatar: firebaseUser.photoURL,
                            },
                            { withCredentials: true }
                        );
                        console.log("useGetCurrentUser: Backend login success. Token stored.");
                        if (data.token) {
                            localStorage.setItem("token", data.token);
                        }
                        dispatch(setUserData(data));
                    } catch (innerError) {
                        console.error("useGetCurrentUser: Backend login FAILED completely:", innerError.response ? innerError.response.data : innerError.message);
                        dispatch(setUserData(null));
                    }
                }
            } else {
                console.log("useGetCurrentUser: No Firebase user found.");
                localStorage.removeItem("token");
                dispatch(setUserData(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
}

export default useGetCurrentUser;