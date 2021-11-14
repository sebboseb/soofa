//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, onSnapshot, documentId, query, collection, where, getDocs } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { Typography } from '@mui/material'

function Activity() {

    const { profileId } = useParams();

    const { currentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [claimed, setClaimed] = useState([]);
    const [followed, setFollowed] = useState([]);
    const [thisUser, setThisUser] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            db.collection("Following").doc(currentUser.uid).collection("UserFollowing").onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id); // For doc name
                    setFollowed(prevFollowed => prevFollowed.concat(doc.id
                        // data().username
                    ));
                });
            });
        }

        getUsers();
    }, []);

    async function loadFeed() {
        const q = query(collection(db, "Posts"), where(documentId(), 'in', followed));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let murlocdata = Object.values(doc.data());
            console.log(murlocdata);
            console.log(doc.id, " => ", doc.data());
            setFeed(murlocdata);
        });
    }

    return (
        <>
            <div className=" text-white font-semibold text-3xl">
                {currentUser.uid}
                <button onClick={() => loadFeed()}>Load feed</button>
            </div>
            <ul>
                {feed.map((thingy) => (
                    <li className=" bg-white">
                        <div className="flex">
                        <img src={`https://image.tmdb.org/t/p/original${thingy.poster_path}`} alt="" className=" w-24" />
                            <div>{thingy.user} watched {thingy.name} and rated it {thingy.star_rating} stars</div>
                        
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Activity;