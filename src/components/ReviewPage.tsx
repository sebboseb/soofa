// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import Review from './Review';
import { getSearchRequest } from './utils/api';

function ReviewPage() {

    const { id } = useParams();

    const [reviewsUpdate, setReviewsUpdate] = useState([]);
    const [succession, setSuccession] = useState([]);

    useEffect(() => {
        async function getReviews() {
            const snapshotqk = await db.collection('Posts').doc("Reviews").collection("userPosts").doc(id).collection("post").get()
            const followingMurloc = snapshotqk.docs.map(doc => doc.data());
            console.log(followingMurloc);
            setReviewsUpdate(followingMurloc);

            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            setSuccession(seriesList[0]);
        }

        getReviews();
    }, [id]);

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
        <div className=" w-screen flex justify-center relative">
            <div className=" absolute left-16 top-16 flex">
                <Link to={`/series/${succession.name && succession.name.replaceAll(' ', '-')}`}>
                <img src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} className="min-w-max max-w-min h-80 rounded m-1 border-gray-50 border shadow sticky" alt={succession.name}></img></Link>
            </div>
            <div className=" w-full max-w-6xl min-h-screen h-auto dark:bg-letterboxd-bg flex items-center justify-center">
                {reviewsUpdate.length !== 0 ?
                    <ul className="space-y-4 max-w-xl w-screen mt-16">
                        <div className="flex justify-between dark:text-white">
                            <h1>Popular Reviews</h1>
                        </div>
                        {reviewsUpdate.map((thingy, index) => (
                            index <= 40 &&
                            <li className=" dark:text-white border-t dark:border-white border-black">
                                <div className="flex justify-between mt-4">
                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <Review user={thingy.user} review={thingy.review} stars={thingy.starrating}></Review>
                                        </div>
                                    </div>
                                    <div>{sortArray(thingy.date)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    :
                    <div className="dark:text-white border-t dark:border-white border-black max-w-xl w-screen mt-16">
                        <h1 className="mt-4 ml-2">Be the first one to leave a review!</h1>
                    </div>
                }
            </div>
        </div>
    )
}

export default ReviewPage;