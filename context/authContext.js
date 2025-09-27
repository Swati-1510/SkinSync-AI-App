import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from "react";
import { auth, usersRef } from "../firebaseConfig";


WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [routine, setRoutine] = useState(null);

    // This onAuthStateChanged listener is perfect, it will automatically
    // handle the user state after a successful Firebase sign-in.
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log('onAuthStateChanged triggered with user:', user);
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const updateUserData = async (userId) => {
        console.log('updateUserData called with userId:', userId);
        const docRef = doc(usersRef, userId);
        console.log('docRef created:', docRef);
        const docSnap = await getDoc(docRef);
        console.log('docSnap received:', docSnap);

        if (docSnap.exists()) {
            console.log('docSnap exists');
            let data = docSnap.data();
            console.log('data from docSnap:', data);
            setUser(currentUser => {
                console.log('setUser called with currentUser:', currentUser);
                console.log('merging with data:', data);
                return { ...currentUser, ...data };
            });
        } else {
            console.log('docSnap does not exist for userId:', userId);
        }
    }

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);


            if (response.user) {
                await updateUserData(response.user.uid);
            }

            return { success: true };
        } catch (e) {
            let msg = e.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            if (msg.includes('(auth/invalid-credential)')) msg = 'Invalid credentials';
            return { success: false, msg };
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true }
        } catch (e) {
            return { success: false, msg: e.message, error: e };
        }
    }

    const register = async (username, email, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(usersRef, response?.user?.uid), {
                username,
                userId: response?.user?.uid
            });
            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email'
            if (msg.includes('(auth/email-already-in-use)')) msg = 'The email is already in use'
            return { success: false, msg };
        }
    }

    // Saving skin profile details 

    const saveSkinProfile = async (skinProfileData) => {
        try {
            if (!user) {
                throw new Error("No user is currently logged in.")
            }

            const userDocRef = doc(usersRef, user.uid);

            await updateDoc(userDocRef, {
                skinProfile: skinProfileData
            });

            return { success: true, msg: "Skin profile saved successfully!" };

        } catch (e) {
            console.error("Error saving skin profile:", e);
            return { success: false, msg: e.message };
        }
    }

    const updateUserRoutine = (newRoutine) => {
        console.log("Global routine state is being updated.");
        setRoutine(newRoutine);
    };




    // --- UPDATED GOOGLE SIGN-IN LOGIC ---

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '763365604796-3mug30r7rd91v1ce4h831tgmtb65g99u.apps.googleusercontent.com',
        androidClientId: '763365604796-i87fu34e4c5sbt65j2tm4kp4efsr1f3v.apps.googleusercontent.com',
        webClientId: '763365604796-i87fu34e4c5sbt65j2tm4kp4efsr1f3v.apps.googleusercontent.com',
    });

    // This useEffect now handles signing into FIREBASE with the Google token
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;

            // Create a Google credential with the token
            const credential = GoogleAuthProvider.credential(id_token);

            // Sign in to Firebase with the credential
            signInWithCredential(auth, credential)
                .then(userCredential => {
                    // This is where you could add new user data to Firestore if they are signing in for the first time
                    console.log("Successfully signed in to Firebase with Google!");
                })
                .catch(error => {
                    console.error("Firebase sign-in error:", error);
                });
        } else if (response?.type === 'error') {
            console.log("Google Sign-In Error:", response.params.error);
        }
    }, [response]);


    const loginWithGoogle = async () => {
        promptAsync();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, routine, updateUserRoutine, login, register, logout, loginWithGoogle, saveSkinProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
}