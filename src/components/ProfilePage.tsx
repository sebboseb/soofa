//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot, documentId, collection, query, limit, getDocs, orderBy, deleteDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { Link, useParams, useHistory } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function ProfilePage() {

    const { profileId } = useParams();

    const history = useHistory();

    const { currentUser, logout } = useAuth();
    const [username, setUsername] = useState("");
    const [claimed, setClaimed] = useState([]);
    const [currentUid, setCurrentUid] = useState("");
    const [followed, setFollowed] = useState([]);
    const [thisUser, setThisUser] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [error, setError] = useState("");
    const [followers, setFollowers] = useState([]);
    const [recentSeries, setRecentSeries] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            setFollowed([]);
            setFollowers([]);
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
                        const murl1 = mapData.sort((b, c) => c.id - b.id);
                        const murl3 = murl1.sort((b, c) => c.star_rating - b.star_rating);
                        setClaimed(murl3);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                });

                //Get current profiles followed
                if (currentUser) {
                    const snapshot = await db.collection('Following').doc(currentUid).collection("UserFollowing").get()
                    const followingMurloc = snapshot.docs.map(doc => doc.id);
                    // setFollowed(followingMurloc);

                    db.collection("Following").doc(currentUser.uid).collection("UserFollowing").where(documentId(), "==", currentUid).onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            setIsFollowing(true);
                            console.log("Following"); // For doc name
                        });
                    });

                    db.collectionGroup("UserFollowing").where("uid", "==", currentUid).onSnapshot((querySnapshot) => {
                        querySnapshot.forEach(async doc => {
                            // console.log("Murloc " + doc.id); // For doc name
                            const murlocs = (doc.ref.path.replace('Following/', '').replace(`/UserFollowing/${currentUid}`, ''));
                            const murlocsUsername = await db.collection("User").doc(murlocs).get();
                            setFollowers(prevFollowed => prevFollowed.concat(murlocsUsername.data()));
                        });
                    });

                    followingMurloc.forEach(async murloc => {
                        const qk = await db.collection('User').doc(murloc).get();
                        console.log(qk.data().Username);
                        setFollowed(prevFollowed => prevFollowed.concat(qk.data()));
                        // setFeed(prevFollowed => prevFollowed.concat(murlocdata));
                    });

                    //recent activity
                    // const qkn = await db.collection('Posts').doc(currentUser.uid).collection("userPosts").doc("Logs").collection("logSeries").get();
                    // let murlocdata = Object.values(qkn.docs.map(doc => doc.data()));
                    // console.log(murlocdata)
                    // setRecentSeries(prevRecent => prevRecent.concat(murlocdata));

                    const usersReference = collection(db, "Posts", (currentUid), "userPosts", "Logs", "logSeries");
                    const qkn = query(usersReference, orderBy("date", "desc"), limit(4));
                    const qreturn = await getDocs(qkn)
                    const followingMurlocq = qreturn.docs.map(doc => doc.data());
                    console.log(followingMurlocq);
                    setRecentSeries(followingMurlocq);
                }



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

            currentUser && db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getUsers();
    }, [currentUser, profileId, currentUid]);

    const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Series") : null;
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

    async function deleteRating() {
        await deleteDoc(userDocumentFav);
    }

    function followFunction() {
        setIsFollowing(true);
        db.collection("Following")
            .doc(currentUser.uid)
            .collection("UserFollowing")
            .doc(currentUid)
            .set({ uid: currentUid })
    }

    function unfollowFunction() {
        setIsFollowing(false);
        db.collection("Following")
            .doc(currentUser.uid)
            .collection("UserFollowing")
            .doc(currentUid)
            .delete()
    }

    // async function loadFeed() {
    //     // db.collection("Posts").where(documentId(),'in',followed).onSnapshot((querySnapshot) => {
    //     //     querySnapshot.forEach((doc) => {
    //     //         console.log("LETS GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    //     //         console.log(doc.data().legolas);
    //     //         // setFeed(doc.data());
    //     //     });
    //     // });

    //     const q = query(collection(db, "Posts"), where(documentId(), 'in', followed));

    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         let murlocdata = Object.values(doc.data());
    //         console.log(murlocdata);
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // }

    async function handleLogout() {
        setError("");
        try {
            await logout();
            history.push("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <div className=" w-screen flex justify-center relative">
                <div className=" w-full max-w-6xl min-h-screen h-auto dark:bg-letterboxd-bg flex justify-center">
                    <div className=" dark:text-white font-semibold text-3xl flex flex-col">
                        {/* {currentUid} */}
                        {error}
                        <div className="flex justify-between">
                            {profileId}
                            {(currentUser && (currentUid === currentUser.uid)) && <button className="dark:text-white font-semibold" onClick={handleLogout}>Log Out</button>}
                        </div>
                        {(currentUser && (currentUid !== currentUser.uid)) &&
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
                        <div>
                            <div>
                                <ul className="flex max-w-screen flex-wrap justify-center md:justify-start">
                                    {claimed.map((claims, index) => (
                                        <div key={claims.id} className="flex flex-col items-center mx-1 my-1">
                                            <Link to={`/series/${(claims.name).replace(/\s/g, '-')}`}>
                                                <img src={`https://image.tmdb.org/t/p/original${claims.poster_path}`} alt="" className=" w-40 rounded border-white border" />
                                            </Link>
                                            {/* <div>{claims.star_rating}</div> */}
                                            <StarRatings
                                                rating={claims.star_rating}
                                                starRatedColor="#f59e0b"
                                                numberOfStars={5}
                                                starDimension="24px"
                                                starSpacing="1px"
                                                changeRating={username === profileId ? changeRating : null}
                                                name={index.toString()}
                                                starHoverColor="#f59e0b"
                                            />
                                        </div>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex space-x-8">
                                <div className=" flex flex-col">
                                    Following {followed.length}
                                    {followed.map((user) => (
                                        <ul key={user.Uid} className="list-none">
                                            <li>{user.Username}</li>
                                        </ul>
                                    ))}
                                </div>
                                <div className=" flex flex-col">
                                    Followers {followers.length}
                                    {followers.map((user) => (
                                        <ul key={user.Uid} className="list-none">
                                            <li>
                                                <Link to={`/${user.Username}`}>
                                                    {user.Username}
                                                </Link>
                                            </li>
                                        </ul>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className=" mt-24">
                            <h1 className="text-white font-semibold text-xl">Recent Activity</h1>
                            <div className="border-t border-white mb-1"></div>
                            <ul className="flex max-w-screen flex-wrap justify-center md:justify-start">
                                {recentSeries.map((recentClaims, index) => (
                                    <div className="flex flex-col items-center mx-1 my-1">
                                        <Link to={`/series/${(recentClaims.review.name).replace(/\s/g, '-')}`}>
                                            <img src={`https://image.tmdb.org/t/p/original${recentClaims.review.poster_path}`} alt="" className=" w-40 rounded border-white border" />
                                        </Link>
                                        {/* <div>{recentClaims.review.star_rating}</div> */}
                                        <div className="flex items-center">
                                            <StarRatings
                                                rating={recentClaims.review.star_rating}
                                                starRatedColor="#f59e0b"
                                                numberOfStars={5}
                                                starDimension="24px"
                                                starSpacing="1px"
                                                name={index.toString()}
                                                starHoverColor="#f59e0b"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </ul>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage;