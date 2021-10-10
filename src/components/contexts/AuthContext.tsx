// @ts-nocheck

import React, {useContext, useState, useEffect} from 'react';
import { auth, db } from '../../firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

const [currentUser, setCurrentUser] = useState();
const [loading, setLoading] = useState(true);

function signup(email, password, usernameLol) {
    return auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection("User").doc(cred.user.uid).set({
            Name: "", Mana: 0, Email: cred.user.email, Username: usernameLol, Uid: cred.user.uid
        })
    });
}

function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

function logout() {
    return auth.signOut();
}

function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
}

function updateEmail(email) {
    return currentUser.updateEmail(email);
}

function updatePassword(password) {
    return currentUser.updatePassword(password);
}

useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
        setLoading(false);
    });

    return unsubscribe;
}, [])



    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
