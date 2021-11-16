//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { documentId, query, collection, where, getDocs } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function Activity() {

    const { currentUser } = useAuth();
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            setFeed([])
            const snapshot = await db.collection('Following').doc(currentUser.uid).collection("UserFollowing").get()
            const followingMurloc = snapshot.docs.map(doc => doc.id);
            console.log(followingMurloc);

            const q = query(collection(db, "Posts"), where(documentId(), 'in', followingMurloc));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let murlocdata = Object.values(doc.data());
                console.log(murlocdata);
                console.log(doc.id, " => ", doc.data());
                setFeed(prevFollowed => prevFollowed.concat(murlocdata
                ));
            });
        }

        getUsers();
    }, [currentUser.uid]);

    return (
        <>
            <div className="w-screen flex justify-center">
                <div className="flex flex-col max-w-xl w-screen">
                    <ul className="space-y-4">
                        {feed.map((thingy) => (
                            <li className=" dark:text-white border-t dark:border-white border-black">
                                <div className="flex justify-between mt-4">
                                    <div className="flex">
                                        <Link to={`/series/${(thingy.name).replace(/\s/g, '-')}`}>
                                            <img src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`} alt="" className=" w-20 max-w-none rounded mr-8" />
                                        </Link>
                                        <div className="flex flex-col">
                                            <h1 className="dark:text-gray-300">
                                                <Link to={`/${thingy.user}`}>
                                                    <span className=" dark:text-white">{thingy.user} </span>
                                                </Link>
                                                watched <h1 className=" text-xl dark:text-white">{thingy.name}</h1>
                                                <div className="-mt-1 -ml-1">
                                                    <StarRatings
                                                        rating={thingy.star_rating}
                                                        starRatedColor="#f59e0b"
                                                        numberOfStars={5}
                                                        starDimension="18px"
                                                        starSpacing="1px"
                                                        starHoverColor="#f59e0b"
                                                    />
                                                </div>
                                            </h1>
                                            <h1>{thingy.review}</h1>
                                        </div>
                                    </div>
                                    <div>1h</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Activity;