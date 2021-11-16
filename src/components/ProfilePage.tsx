//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot, documentId, query, collection, where, getDocs } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { Link, useParams, useHistory } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { Typography } from '@mui/material'

function ProfilePage() {

    const { profileId } = useParams();

    const history = useHistory();

    const { currentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [claimed, setClaimed] = useState([]);
    const [currentUid, setCurrentUid] = useState("");
    const [followed, setFollowed] = useState([]);
    const [thisUser, setThisUser] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").where("Username", "==", profileId).onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data()); // For data inside doc
                    console.log(doc.id); // For doc name
                    setCurrentUid(doc.id);
                });
            });

            if (currentUid !== "") {
                const docRef = doc(db, "User", currentUid, "Favourites", "Series");
                // const docSnap = await getDoc(docRef);
                onSnapshot(docRef, (snapshot) => {
                    if (snapshot.exists()) {
                        let mapData = Object.values(snapshot.data());
                        console.log("Document data:", mapData);
                        setClaimed(mapData);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                });

                //Get current profiles followed
            const snapshot = await db.collection('Following').doc(currentUser.uid).collection("UserFollowing").get()
            const followingMurloc = snapshot.docs.map(doc => doc.id);
            setFollowed(followingMurloc);

                db.collection("Following").doc(currentUser.uid).collection("UserFollowing").where(documentId(), "==", currentUid).onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        setIsFollowing(true);
                        console.log("Following"); // For doc name
                    });
                });

                db.collection("UserFollowing").where("username", "==", profileId).onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log("Murloc" + doc.data()); // For data inside doc
                        console.log("Murloc" + doc.id); // For doc name
                    });
                });

                // if (docSnap.exists()) {
                //     let mapData = Object.values(docSnap.data());
                //     console.log("Document data:", mapData);
                //     setClaimed(mapData);
                // } else {
                //     // doc.data() will be undefined in this case
                //     console.log("No such document!");
                // }

                db.collection("User").doc(currentUid).get().then(doc => {
                    setThisUser([doc.data()]);
                    console.log([doc.data()]);
                });
            }

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getUsers();
    }, [currentUser, profileId, currentUid]);

    const userDocumentFav = doc(db, "User", currentUser.uid, "Favourites", "Series");
    // const followDocument = currentUid !== "" ? doc(db, "Following", (currentUser.uid), "UserFollowing", (currentUid)) : null;

    async function changeRating(newRating, name) {
        const starrating = { star_rating: newRating }
        Object.assign(claimed[name], starrating);
        console.log(name);
        console.log(claimed[name].name);

        await updateDoc(userDocumentFav, {
            [claimed[name].name]: claimed[name]
        });
    }

    function followFunction() {
        setIsFollowing(true);
        db.collection("Following")
            .doc(currentUser.uid)
            .collection("UserFollowing")
            .doc(currentUid)
            .set({})
    }

    function unfollowFunction() {
        setIsFollowing(false);
        db.collection("Following")
            .doc(currentUser.uid)
            .collection("UserFollowing")
            .doc(currentUid)
            .delete()
    }

    async function loadFeed() {
        // db.collection("Posts").where(documentId(),'in',followed).onSnapshot((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log("LETS GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
        //         console.log(doc.data().legolas);
        //         // setFeed(doc.data());
        //     });
        // });

        const q = query(collection(db, "Posts"), where(documentId(), 'in', followed));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let murlocdata = Object.values(doc.data());
            console.log(murlocdata);
            console.log(doc.id, " => ", doc.data());
        });
    }

    async function handleLogout() {
        setError("");
        try {
            await logout();
            history.push("/");
        } catch {
            setError("Error")
        }
    }

    return (
        <>
            <div className=" dark:text-white font-semibold text-3xl">
                {currentUid}
                <Typography
                    variant="h4"
                >{profileId}</Typography>
                {currentUser && <button className="dark:text-white font-semibold" onClick={handleLogout}>Log Out</button>}
                {currentUid !== currentUser.uid &&
                    <button className="dark:text-white font-semibold bg-green-400 rounded shadow p-3 text-sm hover:bg-green-500"
                        onClick={() =>
                            isFollowing ?
                                unfollowFunction() :
                                followFunction()
                            // setDoc(followDocument, {
                            //     username: thisUser[0].Username
                            // })
                        }
                    >
                        {isFollowing ? <h1>Unfollow</h1> : <h1>Follow</h1>}</button>}
                {/* <p className="text-center md:text-left">{username}</p> */}
                <ul className="flex max-w-screen flex-wrap justify-center md:justify-start">
                    {claimed.map((claims, index) => (
                        <div key={claims.id} className="flex flex-col items-center p-1">
                            <Link to={`/series/${(claims.name).replace(/\s/g, '-')}`}>
                                <img src={`https://image.tmdb.org/t/p/original${claims.poster_path}`} alt="" className=" w-40" />
                            </Link>
                            {/* <div>{claims.star_rating}</div> */}
                            <StarRatings
                                rating={claims.star_rating}
                                starRatedColor="#f59e0b"
                                numberOfStars={5}
                                starDimension="24px"
                                starSpacing="1px"
                                changeRating={username === profileId ? changeRating : null}
                                name={index}
                                starHoverColor="#f59e0b"
                            />
                        </div>
                    ))}
                </ul>
                <button onClick={() => loadFeed()}>Load feed</button>
                <div>
                    <h1>Following</h1>
                    <ul>
                        {
                            followed.map((follow) => <li>{follow}</li>)
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ProfilePage;