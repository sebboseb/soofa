//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function ProfilePage() {

    const { currentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [claimed, setClaimed] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const docRef = doc(db, "User", currentUser.uid, "Favourites", "Series");
            const docSnap = await getDoc(docRef);
            let mapData = Object.values(docSnap.data());
            
            if (docSnap.exists()) {
                console.log("Document data:", mapData[0].name);
                setClaimed(mapData);
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getUsers();
    }, [])

    return (
        <>
        <Navbar username={username}></Navbar>
        <div className=" text-white font-semibold text-3xl">
            <p>{username}</p>

            <ul className="flex">
            {claimed.map((claims, index) => (
                <div className="flex flex-col items-center p-1">
                    <Link to={`/series/${(claims.name).replace(/\s/g, '-')}`}>
                <img src={`https://image.tmdb.org/t/p/original${claims.poster_path}`} alt="" className=" w-40"/>
                </Link>
                <div>{claims.star_rating}</div>
                </div>
            ))}</ul>
        </div>
        </>
    )
}

export default ProfilePage;
