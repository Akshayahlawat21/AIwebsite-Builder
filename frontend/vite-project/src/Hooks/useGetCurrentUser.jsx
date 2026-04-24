import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function useGetCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // First, try fetching the user from our backend (cookie-based session)
                    const result = await axios.get(
                        `${serverUrl}/api/user/me`,
                        { withCredentials: true }
                    );

                    // If backend returned a valid user object with an _id, set it
                    if (result.data && result.data._id) {
                        dispatch(setUserData(result.data));
                    } else {
                        // No cookie session yet (first login after redirect).
                        // Register/login the user in our backend to create the cookie.
                        const { data } = await axios.post(
                            `${serverUrl}/api/auth/google`,
                            {
                                name: firebaseUser.displayName,
                                email: firebaseUser.email,
                                avatar: firebaseUser.photoURL,
                            },
                            { withCredentials: true }
                        );
                        dispatch(setUserData(data));
                    }
                } catch (error) {
                    // Network error or 401 — try to register with Google info
                    try {
                        console.log("Session not found, creating new session...", error.message);
                        const { data } = await axios.post(
                            `${serverUrl}/api/auth/google`,
                            {
                                name: firebaseUser.displayName,
                                email: firebaseUser.email,
                                avatar: firebaseUser.photoURL,
                            },
                            { withCredentials: true }
                        );
                        dispatch(setUserData(data));
                    } catch (innerError) {
                        console.error("Auth failed completely:", innerError);
                        dispatch(setUserData(null));
                    }
                }
            } else {
                dispatch(setUserData(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
}

export default useGetCurrentUser;