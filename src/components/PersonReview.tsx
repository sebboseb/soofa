//@ts-nocheck

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getSearchRequest } from './utils/api';
import { useAuth } from './contexts/AuthContext';


function PersonReview() {

    const { profileId, id, indexId } = useParams();

    const { currentUser } = useAuth();

    const [review, setReview] = useState([]);
    const [query, setQuery] = useState("");
    const [postId, setPostId] = useState(makeid(9));
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

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getReview();
    }, []);

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
        setPostId(makeid(9))
        const commentReviewref = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "postSeries", reviewId);
        await updateDoc(commentReviewref, {
            comments: arrayUnion({ comment: query, user: username }),
        });
    }

    return (
        <div>
            <Link to={`/series/${succession.name}`}><img className="w-44" src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} alt="" /></Link>
            <div className="flex flex-col">
                <h1 className="text-white">{review.review}</h1>
                <h1 className="text-white" onClick={() => commentReview(review.reviewId)}>Comment</h1>
                <input className="" type="text" value={query} onChange={onChange} />
            </div>
            <ul className="text-white">
                {review.comments && review.comments.map((comment) => (
                    <li>{comment.comment} {comment.user}</li>
                ))}
            </ul>
        </div>
    )
}

export default PersonReview;