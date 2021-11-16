// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import Review from './Review';

function ReviewPage() {

    const { id } = useParams();

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function getReviews() {
            const snapshot = await db.collection("Posts").doc(id.replaceAll('-', ' ')).collection("userPosts").get();
            console.log(snapshot.docs.map(doc => doc.data()));
            setReviews(snapshot.docs.map(doc => doc.data()));
    


            db.collection("User").where("Username", "==", "sebboseb").onSnapshot((querySnapshot) => {querySnapshot.forEach((doc) => {
                console.log(doc.data()); // For data inside doc
                console.log(doc.id); // For doc name
            })});



    
        }
        getReviews();
    }, [id]);

    // Print each document

    

    return (
        <div className="flex justify-center">
            <ul className="bg-white max-w-3xl w-screen rounded dark:shadow mt-4 p-1">
                {reviews.map((thingy) => (
                    <Review user={thingy.user} review={thingy.review} stars={thingy.starrating}></Review>
                ))}
            </ul>
        </div>
    )
}

export default ReviewPage;