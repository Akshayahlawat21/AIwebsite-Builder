import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { auth } from "../firebase";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

function useGetCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleAuth = async (firebaseUser) => {
            if (!firebaseUser) {
                console.log("useGetCurrentUser: No User Found.");
                localStorage.removeItem("token");
                dispatch(setUserData(null));
                return;
            }

            console.log("useGetCurrentUser: Processing User:", firebaseUser.email);
            try {
                // Try session check
                const result = await axios.get(`${serverUrl}/api/user/me`, {
                    withCredentials: true,
                    headers: getAuthHeaders()
                });

                if (result.data && result.data._id) {
                    console.log("useGetCurrentUser: Session Alive.");
                    dispatch(setUserData(result.data));
                } else {
                    throw new Error("Invalid session");
                }
            } catch (error) {
                console.log("useGetCurrentUser: Session failed/missing. Creating new...");
                try {
                    const { data } = await axios.post(`${serverUrl}/api/auth/google`, {
                        name: firebaseUser.displayName,
                        email: firebaseUser.email,
                        avatar: firebaseUser.photoURL,
                    }, { withCredentials: true });
                    
                    if (data.token) { localStorage.setItem("token", data.token); }
                    dispatch(setUserData(data));
                } catch (inner) {
                    console.error("useGetCurrentUser: Backend Error:", inner.message);
                }
            }
        };

        // 1. Check for immediate redirect result (Aggressive Check)
        console.log("useGetCurrentUser: Scanning for Redirect Result...");
        getRedirectResult(auth).then((result) => {
            if (result?.user) {
                console.log("useGetCurrentUser: Redirect Payload Found!");
                handleAuth(result.user);
            }
        }).catch(err => console.error("useGetCurrentUser: Redirect Error:", err));

        // 2. Standard State Listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("useGetCurrentUser: State Listener Fired. User:", user?.email || "NULL");
            handleAuth(user);
        });

        return () => unsubscribe();
    }, [dispatch]);
}

export default useGetCurrentUser;