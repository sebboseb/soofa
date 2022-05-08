//@ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getSearchRequest } from './utils/api';
import { useAuth } from './contexts/AuthContext';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import StarRatings from 'react-star-ratings';

function PersonReview() {

    const { profileId, id, indexId } = useParams();

    const { currentUser } = useAuth();

    const [review, setReview] = useState([]);
    const [query, setQuery] = useState("");
    const [succession, setSuccession] = useState([]);
    const [username, setUsername] = useState("");


    useEffect(() => {
        async function getReview() {
            db.collection("Posts").doc("Reviews").collection("userPosts").doc((id.replaceAll('-', ' '))).collection("postSeries").where("user", "==", profileId).where("index", "==", indexId).onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    setReview(doc.data());
                });
            });

            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            setSuccession(seriesList[0]);

            if (currentUser) {
                db.collection("User").doc(currentUser.uid).get().then(doc => {
                    setUsername(doc.data().Username);
                });
            }
        }

        getReview();
    }, [id, indexId, profileId]);

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);
    }

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    async function commentReview(reviewId) {
        // setPostId(makeid(9))
        const commentReviewref = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "postSeries", reviewId);
        let date = Date().toLocaleLowerCase();
        await updateDoc(commentReviewref, {
            comments: arrayUnion({ comment: query, user: username, datecomment: date }),
        });
    }

    async function likeReview() {
        const likeReviewref = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "postSeries", review.reviewId);
        await updateDoc(likeReviewref, {
            likes: arrayUnion({ user: username })
            // increment(1),
        });
    }

    async function deleteLike() {
        const likeReviewref = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "postSeries", review.reviewId);
        await updateDoc(likeReviewref, {
            likes: arrayRemove({ user: username }),
            // increment(1),
        });
    }

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
        <div className=" w-screen flex justify-center relative">
            <div className='max-w-6xl w-screen absolute'>
                <div className=" absolute left-4 top-16 flex">
                    <Link to={`/series/${succession.name && succession.name.replaceAll(' ', '-')}`}>
                        <img src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} className="min-w-max max-w-min h-80 rounded m-1 border-gray-50 border shadow sticky" alt={succession.name}></img></Link>
                </div>
            </div>
            <div className=" w-full max-w-6xl min-h-screen text-white dark:bg-letterboxd-bg flex justify-center dark:text-white">
                <div className="flex flex-col">
                    {review.length !== 0 ?
                        <ul className="space-y-4 max-w-xl w-screen mt-16">
                            <div className="flex flex-col h-80">
                                <div className="flex border-white border-b pb-2 items-center gap-1">
                                    <div className="w-8 h-8 bg-green-400 rounded-full"></div>
                                    <h1 className="">Review by <span className="font-semibold">{review.user.charAt(0).toUpperCase() + review.user.slice(1)}</span></h1>
                                </div>
                                {/* <div className="flex items-center gap-4"> */}
                                <h1 className="text-3xl font-semibold">{review.seriesname}</h1>
                                <StarRatings
                                    rating={review.starrating}
                                    starRatedColor="#f59e0b"
                                    numberOfStars={5}
                                    starDimension="20px"
                                    starSpacing=".5px"
                                    changeRating={""}
                                    name="rating"
                                    starHoverColor="#f59e0b"
                                />
                                {/* </div> */}
                                <h1>Watched {review.date.split(' ')[0]} {review.date.split(' ')[1]} {review.date.split(' ')[2]} {review.date.split(' ')[3]}</h1>
                                {/* <h1>{review.starrating}</h1> */}
                                <h1 className=" mt-16">{review.review}</h1>
                                <div className="flex flex-col justify-end flex-1">
                                    <div className="">
                                        {
                                            review.likes.find(user => user.user === username) ?
                                                <div onClick={() => deleteLike(review.reviewId)} className="flex items-center gap-1 cursor-pointer"><BsHeartFill color={"#f59e0b"} /><h1>Like Review</h1></div>
                                                : <div onClick={() => likeReview()} className="flex items-center gap-1 cursor-pointer"><BsHeart></BsHeart><h1>Like Review</h1></div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {review.comments.length !== 1 ? <h1 className="border-white border-b pb-2">{review.comments.length} Comments</h1> : <h1 className="border-white border-b">{review.comments.length} Comment</h1>}
                            <div className="">
                                {review.comments !== [] && review.comments.map((comment) => (
                                    <div className="flex justify-between items-center gap-1 mt-4 border-gray-600 border-b pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-400 rounded-full"></div>
                                            <li className="flex">{comment.user.charAt(0).toUpperCase() + comment.user.slice(1)}</li>
                                            <span className="ml-16">{comment.comment}</span>
                                        </div>
                                        <h1>{sortArray(comment.datecomment)}</h1>
                                    </div>
                                ))}
                            </div>
                        </ul>
                        :
                        <div className="dark:text-white border-t dark:border-white border-black max-w-xl w-screen mt-16">
                            <h1 className="mt-4 ml-2">Be the first one to leave a review!</h1>
                        </div>

                    }
                    <div className="flex flex-col items-end">
                        <textarea className=" w-full max-w-xl h-44 align-text-top p-4 text-lg rounded bg-gray-600" type="text" value={query} onChange={onChange} placeholder={currentUser ? `Reply as ${username.charAt(0).toUpperCase() + username.slice(1)}...` : `Sign in to leave a comment`}></textarea>
                        <h1 className=" w-24 h-12 flex items-center justify-center bg-soofa-orange hover:bg-yellow-600 rounded mt-4 cursor-pointer font-semibold" onClick={() => commentReview(review.reviewId)}>Comment</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonReview;