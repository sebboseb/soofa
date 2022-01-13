//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from './contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function Activity() {

    const { currentUser } = useAuth();
    const [feed, setFeed] = useState([]);

    const [username, setUsername] = useState("");

    const { activityId } = useParams();

    useEffect(() => {
        const getUsers = async () => {
            setFeed([])
            const snapshot = await db.collection('Following').doc(currentUser.uid).collection("UserFollowing").get();
            const followingMurloc = snapshot.docs.map(doc => doc.id);
            // console.log(followingMurloc);

            followingMurloc.forEach(async murloc => {
                const qk = await db.collection('Posts').doc(murloc).collection("userPosts").doc("Logs").collection(`post${activityId.charAt(0).toUpperCase() + activityId.slice(1)}`).get();
                const qklol = await db.collection('Posts').doc(murloc).collection("userPosts").doc("Logs").collection(`log${activityId.charAt(0).toUpperCase() + activityId.slice(1)}`).get();
                let murlocdata = Object.values(qk.docs.map(doc => doc.data()));
                let murlocdatalol = Object.values(qklol.docs.map(doc => doc.data()));
                // console.log(murlocdata)
                setFeed(prevFollowed => prevFollowed.concat(murlocdata, murlocdatalol).sort((b, c) => parseFloat(c.review.dateseconds) - parseFloat(b.review.dateseconds)));

                currentUser && db.collection("User").doc(currentUser.uid).get().then(doc => {
                    setUsername(doc.data().Username);
                });
            });
        }

        getUsers();
    }, [currentUser.uid, activityId, currentUser]);
    //
    function sortArray(reviewDate) {
        let date = new Date();
        let date3 = new Date(reviewDate);

        let murlocMinute = parseInt((Math.abs((date3.getMinutes() - date.getMinutes()))));
        let murlocHour = parseInt((Math.abs(date3.getTime() - date.getTime())) / 3600000);
        let murlocDay = parseInt((Math.abs(date3.getTime() - date.getTime())) / 3600000 / 24);
        let murlocDayText = (murlocDay + " day ago");
        let murlocDaysText = (murlocDay + " days ago");
        let murlocHourText = (murlocHour + "h ago");
        let murlocMinuteText = (murlocMinute + " min ago");

        if (murlocHour <= 1) { return murlocMinuteText }
        if (murlocDay > 1) { return murlocDaysText }
        if (murlocHour <= 23) { return murlocHourText }
        if (murlocHour >= 24) { return murlocDayText }
    }

    return (
        <>
            <div className="w-screen flex justify-center">
                <div className="flex flex-col max-w-xl w-screen">
                    <div className="flex space-x-4">
                        <u className=" text-soofa-orange">Friends</u>
                        <Link to={`/${username}/activity/${activityId}`} className=" text-soofa-orange">You</Link>
                    </div>
                    <div className="flex max-w-xl w-screen justify-between text-white font-semibold text-xl">
                        <Link to={`/activity/episode`}>{activityId === "episode" ? <u>Episodes</u> : <h1>Episodes</h1>}</Link>
                        <Link to={`/activity/season`}>{activityId === "season" ? <u>Seasons</u> : <h1>Seasons</h1>}</Link>
                        <Link to={`/activity/series`}>{activityId === "series" ? <u>Shows</u> : <h1>Shows</h1>}</Link>
                    </div>
                    <ul className="space-y-4">
                        {feed.length !== 0 ? feed.map((thingy) => (
                            <li className=" dark:text-white border-t dark:border-white border-black">
                                <div className="flex justify-between mt-4">
                                    <div className="flex">
                                        <Link to={activityId === "series" ? `/series/${thingy.review.name && (thingy.review.name).replace(/\s/g, '-')}` : activityId === "season" ? `/${thingy.review.seriesname && (thingy.review.seriesname).replace(/\s/g, '-')}/season-${thingy.review.season_number}/episodes` : `/${thingy.review.seriesname && (thingy.review.seriesname).replace(/\s/g, '-')}/season-${thingy.review.season_number}/episode/${thingy.review.episode_number}`}>
                                            {/* <Link to={thingy.review.name && `/series/${(thingy.review.name).replace(/\s/g, '-')}`}> */}
                                            <img src={
                                                activityId === "series" ? `https://image.tmdb.org/t/p/original${thingy.review.poster_path}` : activityId === "season" ? `https://image.tmdb.org/t/p/original${thingy.review.poster_path}` : `https://image.tmdb.org/t/p/original${thingy.review.still_path}`} alt="" className={activityId !== "episode" ? "w-20 max-w-none rounded mr-8" : "w-32 max-w-none rounded mr-8"}
                                            />
                                        </Link>
                                        <div className="flex flex-col">
                                            <h1 className="dark:text-gray-300">
                                                <Link to={`/${thingy.review.user}`}>
                                                    <span className=" dark:text-white">{thingy.review.user} </span>
                                                </Link>
                                                {thingy.review.liked === true ? <span>watched and liked</span> : <span>watched</span>}
                                                {thingy.review.review === undefined ? <Link to={activityId === "series" ? `/series/${thingy.review.name}` : activityId === "season" ? `/${thingy.review.seriesname}/season-${thingy.review.season_number}/episodes` : `/${thingy.review.seriesname}/season-${thingy.review.season_number}/episode/${thingy.review.episode_number}`}>
                                                    <h1 className=" text-xl dark:text-white">
                                                        {activityId === "series" ? `${thingy.review.name}` : activityId === "season" ? `${thingy.review.seriesname} ${thingy.review.name}` : `${thingy.review.name}`}
                                                    </h1>
                                                </Link> : <Link to={`/${thingy.review.user}/${thingy.review.seriesname && thingy.review.seriesname.replaceAll(' ', '-')}/${thingy.review.index}/`}><h1 className=" text-xl dark:text-white">
                                                    {activityId === "series" ? `${thingy.review.name}` : activityId === "season" ? `${thingy.review.seriesname} ${thingy.review.name}` : `${thingy.review.name}`}
                                                </h1></Link>}
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
                        )) : <div><h1 className="text-white font-semibold text-center">No activity yet</h1></div>}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Activity;