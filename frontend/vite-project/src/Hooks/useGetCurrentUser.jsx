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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const result = await axios.get(
                        `${serverUrl}/api/user/me`,
                        { withCredentials: true }
                    );
                    dispatch(setUserData(result.data));
                } catch (error) {
                    console.log("Failed to fetch user data from backend:", error);
                }
            } else {
                dispatch(setUserData(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
}

export default useGetCurrentUser;