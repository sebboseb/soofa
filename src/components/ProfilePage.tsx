//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, getDoc, orderBy, where } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import { Link, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import {Typography} from '@mui/material'

function ProfilePage() {

    const { profileId } = useParams();

    const { currentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [claimed, setClaimed] = useState([]);
    const [murlocWarleader, setMurlocWarleader] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const docRef = doc(db, "User", currentUser.uid, "Favourites", "Series");
            const docSnap = await getDoc(docRef);
            

            if (docSnap.exists()) {
                let mapData = Object.values(docSnap.data());
            setMurlocWarleader(mapData);
            console.log(murlocWarleader[0]);
                console.log("Document data:", mapData[0]);
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
    }, []);

    const userDocumentFav = doc(db, "User", currentUser.uid, "Favourites", "Series");
    const followDocument = doc(db, "Following", (currentUser.uid), "UserFollowing", ("aVys1udQtkhX8XD13rvVUQEr9l03"));

    async function changeRating(newRating, name) {
        const starrating = { star_rating: newRating }
        Object.assign(murlocWarleader[name], starrating);
        console.log(name);
        console.log(murlocWarleader[name].name);

        await updateDoc(userDocumentFav, {
            [murlocWarleader[name].name]: murlocWarleader[name]
        });
    }

    function changeRatingLol() {
        console.log("lol");
    }

    return (
        <>
            <div className=" text-white font-semibold text-3xl">
                <Typography
                variant="h4"
                >{username}</Typography>
                <button className="text-white font-semibold bg-green-400 rounded shadow p-3 text-sm hover:bg-green-500"
                onClick={() => 
                    setDoc(followDocument,{
                        coldlight: "followed"
                    })
                }
                >Follow</button>
                {/* <p className="text-center md:text-left">{username}</p> */}
                <ul className="flex max-w-screen flex-wrap justify-center md:justify-start">
                    {claimed.map((claims, index) => (
                        <div key={claims.id} className="flex flex-col items-center p-1">
                            <Link to={`/series/${(claims.name).replace(/\s/g, '-')}`}>
                                <img src={`https://image.tmdb.org/t/p/original${claims.poster_path}`} alt="" className=" w-40" />
                            </Link>
                            {/* <div>{claims.star_rating}</div> */}
                            <StarRatings
                                rating={claims.star_rating}
                                starRatedColor="#f59e0b"
                                numberOfStars={5}
                                starDimension="24px"
                                starSpacing="1px"
                                changeRating={changeRating}
                                name={index}
                                starHoverColor="#f59e0b"
                            />
                        </div>
                    ))}</ul>
            </div>
        </>
    )
}

export default ProfilePage;