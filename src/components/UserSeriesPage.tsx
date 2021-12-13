//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import StarRatings from 'react-star-ratings';
import { useAuth } from './contexts/AuthContext';

function UserSeriesPage() {

    const { profileId } = useParams();

    const { currentUser } = useAuth();

    const [username, setUsername] = useState("");
    const [claimed, setClaimed] = useState([]);
    const [currentUid, setCurrentUid] = useState("");

    useEffect(() => {
        async function getAllSeries() {
            db.collection("User").where("Username", "==", profileId).onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data()); // For data inside doc
                    console.log(doc.id); // For doc name
                    setCurrentUid(doc.id);
                });
            });
            
            if (currentUid !== "") {
                const docRef = await db.collection("User").doc(currentUid).collection("Favourites").doc("Series").collection("ratings").get();
                // const snap = onSnapshot(docRef, (snapshot) => {
                //     console.log("Lol")
                // })
                let docSnap = Object.values(docRef.docs.map(doc => doc.data()[doc.id]));
                const murl1 = docSnap.sort((b, c) => c.id - b.id);
                const murl3 = murl1.sort((b, c) => c.star_rating - b.star_rating);
                setClaimed(murl3);
            }

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getAllSeries();
    }, [profileId, currentUid]);

    return (
        <div className="mt-24">
            <h1 className="text-white">All Series</h1>
            <div>
                <ul className="flex max-w-screen flex-wrap justify-center md:justify-start max-w-2xl">
                    {claimed.map((claims, index) => (
                        <div key={claims.id} className="flex flex-col items-center mx-1 my-1">
                            <Link to={`/series/${(claims.name).replace(/\s/g, '-')}`}>
                                <img src={`https://image.tmdb.org/t/p/original${claims.poster_path}`} alt="" className=" w-40 rounded border-white border" />
                            </Link>
                            <StarRatings
                                rating={claims.star_rating}
                                starRatedColor="#f59e0b"
                                numberOfStars={5}
                                starDimension="24px"
                                starSpacing="1px"
                                changeRating={""}
                                name={index.toString()}
                                starHoverColor="#f59e0b"
                            />
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UserSeriesPage;