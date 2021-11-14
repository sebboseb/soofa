//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, onSnapshot, documentId, query, collection, where, getDocs } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { Typography } from '@mui/material'

function Activity() {

    const { currentUser } = useAuth();
    const [followed, setFollowed] = useState([]);
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        // const getUsers = async () => {
        //     setFollowed([]);
        //     db.collection("Following").doc(currentUser.uid).collection("UserFollowing").onSnapshot((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             console.log(doc.id); // For doc name
        //             setFollowed(prevFollowed => prevFollowed.concat(doc.id
        //                 // data().username
        //             ));
        //         });
        //     });
        // }

        const getUsers = async () => {
            setFollowed([]);
            
            const snapshot = await db.collection('Following').doc(currentUser.uid).collection("UserFollowing").get()
            // snapshot.docs.map(doc => doc.data());
            // console.log(snapshot.docs.map(doc => doc.id));
            const followingMurloc = snapshot.docs.map(doc => doc.id);
            console.log(followingMurloc)

            const q = query(collection(db, "Posts"), where(documentId(), 'in', followingMurloc));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                let murlocdata = Object.values(doc.data());
                console.log(murlocdata);
                console.log(doc.id, " => ", doc.data());
                setFeed(prevFollowed => prevFollowed.concat(murlocdata
                    // data().username
                ));
                // setFeed(murlocdata);
            });


            // const followersMurloc = await db.collection("Following").doc(currentUser.uid).collection("UserFollowing").get()
            // .onSnapshot((querySnapshot) => {
            //     querySnapshot.forEach((doc) => {
            //         console.log(doc.id); // For doc name
            //         setFollowed(prevFollowed => prevFollowed.concat(doc.id
            //             // data().username
            //         ));
            //     });
            // });
            // console.log(followersMurloc.data())
        }

        // const getFeed = async () => {
        //     const q = query(collection(db, "Posts"), where(documentId(), 'in', followed));
        //     const querySnapshot = await getDocs(q);
        //     querySnapshot.forEach((doc) => {
        //         // doc.data() is never undefined for query doc snapshots
        //         let murlocdata = Object.values(doc.data());
        //         console.log(murlocdata);
        //         console.log(doc.id, " => ", doc.data());
        //         setFeed(prevFollowed => prevFollowed.concat(murlocdata
        //             // data().username
        //         ));
        //         // setFeed(murlocdata);
        //     });
        // }

        getUsers();
        // getFeed();
    }, []);

    async function loadFeed() {
        setFeed([]);
        const q = query(collection(db, "Posts"), where(documentId(), 'in', followed));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let murlocdata = Object.values(doc.data());
            console.log(murlocdata);
            console.log(doc.id, " => ", doc.data());
            setFeed(prevFollowed => prevFollowed.concat(murlocdata
                // data().username
            ));
            // setFeed(murlocdata);
        });
    }

    return (
        <>
            <div className="w-screen flex justify-center">
                <div className="flex flex-col max-w-5xl">
                    {/* <div className=" text-white font-semibold text-3xl">
                        {currentUser.uid}
                        <button onClick={() => loadFeed()}>Load feed</button>
                    </div> */}
                    <ul className="space-y-4">
                        {feed.map((thingy) => (
                            <li className=" bg-white">
                                <div className="flex">
                                    <Link to={`/series/${(thingy.name).replace(/\s/g, '-')}`}>
                                        <img src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`} alt="" className=" w-24" />
                                    </Link>

                                    <div className="flex flex-col">
                                        <h1>{thingy.user} watched {thingy.name} and rated it {thingy.star_rating} stars</h1>
                                        <h1>{thingy.review}</h1>
                                    </div>
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