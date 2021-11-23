//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function Activity() {

    const { currentUser } = useAuth();
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            setFeed([])
            const snapshot = await db.collection('Following').doc(currentUser.uid).collection("UserFollowing").get();
            const followingMurloc = snapshot.docs.map(doc => doc.id);
            console.log(followingMurloc);

            followingMurloc.forEach(async murloc => {
                const qk = await db.collection('Posts').doc(murloc).collection("userPosts").doc("Logs").collection("postSeries").get();
                const qklol = await db.collection('Posts').doc(murloc).collection("userPosts").doc("Logs").collection("logSeries").get();
                let murlocdata = Object.values(qk.docs.map(doc => doc.data()));
                let murlocdatalol = Object.values(qklol.docs.map(doc => doc.data()));
                console.log(murlocdata)
                setFeed(prevFollowed => prevFollowed.concat(murlocdata, murlocdatalol));

                // const usersReferencelol = collection(db, "Posts", (murloc), "userPosts", "Logs", "postSeries");
                // const qknlol = query(usersReferencelol, orderBy("review", "asc"));
                // const qreturnlol = await getDocs(qknlol)
                // const followingMurlocqlol = qreturnlol.docs.map(doc => doc.data());
                // console.log(followingMurlocqlol);
                // // setFeed(prevFollowed => prevFollowed.concat(followingMurlocqlol));


                // const usersReference = collection(db, "Posts", (murloc), "userPosts", "Logs", "logSeries");
                // const qkn = query(usersReference, orderBy("date", "asc"));
                // const qreturn = await getDocs(qkn)
                // const followingMurlocq = qreturn.docs.map(doc => doc.data());
                // console.log(followingMurlocq);
                // setFeed(prevFollowed => prevFollowed.concat(followingMurlocq, followingMurlocqlol));
            });
        }

        getUsers();
    }, [currentUser.uid]);

    // function sortArray(reviewDate) {
    //     let date = new Date();
    //     let date3 = new Date(reviewDate);

    //     console.log(parseInt((Math.abs(date3.getTime() - date.getTime())) / 3600000));
    //     let murlocHour = parseInt((Math.abs(date3.getTime() - date.getTime())) / 3600000);
    //     return murlocHour;
    // }

    function sortArray(reviewDate) {
        let date = new Date();
        let date3 = new Date(reviewDate);

        console.log(parseInt((Math.abs(date3.getTime() - date.getTime())) / 3600000));
        let murlocMinute = parseInt((Math.abs(date3.getTime() - date.getTime())) / 360000);
        let murlocHour = parseInt((Math.abs(date3.getTime() - date.getTime())) / 3600000);
        let murlocDay = parseInt((Math.abs(date3.getTime() - date.getTime())) / 3600000 / 24);
        console.log(murlocDay);
        let murlocDayText = (murlocDay + " day ago");
        let murlocDaysText = (murlocDay + " days ago");
        let murlocHourText = (murlocHour + "h ago");
        let murlocMinuteText = (murlocMinute + "min ago");

        if (murlocDay > 1) { return murlocDaysText }
        if (murlocHour <= 23) { return murlocHourText }
        if (murlocHour >= 24) { return murlocDayText }
        if (murlocHour <= 1) { return murlocMinuteText }
    }

    return (
        <>
            <div className="w-screen flex justify-center">
                <div className="flex flex-col max-w-xl w-screen">
                    <ul className="space-y-4">
                        {feed.map((thingy) => (
                            <li className=" dark:text-white border-t dark:border-white border-black">
                                <div className="flex justify-between mt-4">
                                    <div className="flex">
                                        <Link to={`/series/${(thingy.review.name).replace(/\s/g, '-')}`}>
                                            <img src={`https://image.tmdb.org/t/p/original${thingy.review.poster_path}`} alt="" className=" w-20 max-w-none rounded mr-8" />
                                        </Link>
                                        <div className="flex flex-col">
                                            <h1 className="dark:text-gray-300">
                                                <Link to={`/${thingy.review.user}`}>
                                                    <span className=" dark:text-white">{thingy.review.user} </span>
                                                </Link>
                                                watched <Link to={`/series/${thingy.review.name}`}><h1 className=" text-xl dark:text-white">{thingy.review.name}</h1></Link>
                                                <div className="-mt-1 -ml-1">
                                                    <StarRatings
                                                        rating={thingy.review.star_rating}
                                                        starRatedColor="#f59e0b"
                                                        numberOfStars={5}
                                                        starDimension="18px"
                                                        starSpacing="1px"
                                                        starHoverColor="#f59e0b"
                                                    />
                                                </div>
                                            </h1>
                                            <h1>{thingy.review.review}</h1>
                                        </div>
                                    </div>
                                    <div>{sortArray(thingy.review.date)}</div>
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