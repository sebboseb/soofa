//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, getDoc, orderBy } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import { Link, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

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
            let mapData = Object.values(docSnap.data());
            setMurlocWarleader(mapData);
            console.log(murlocWarleader[0]);

            if (docSnap.exists()) {
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
            <Navbar username={username}></Navbar>
            <div className=" text-white font-semibold text-3xl">
                <p>{username}</p>
                <ul className="flex max-w-screen flex-wrap">
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