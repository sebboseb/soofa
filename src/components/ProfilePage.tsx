//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, documentId, collection, query, limit, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { Link, useParams, useHistory } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { GrTextAlignFull } from 'react-icons/gr'

function ProfilePage() {

    const { profileId } = useParams();
    const history = useHistory();
    const { currentUser, logout } = useAuth();

    const [username, setUsername] = useState("");
    const [claimed, setClaimed] = useState([]);
    const [currentUid, setCurrentUid] = useState("");
    const [followed, setFollowed] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [error, setError] = useState("");
    const [followers, setFollowers] = useState([]);
    const [recentSeries, setRecentSeries] = useState([]);
    const [recentSeason, setRecentSeason] = useState([]);
    const [recentEpisode, setRecentEpisode] = useState([]);

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
                // const docRef = doc(db, "User", currentUid, "Favourites", "Series");
                // // const docSnap = await getDoc(docRef);
                // onSnapshot(docRef, (snapshot) => {
                //     if (snapshot.exists()) {
                //         let mapData = Object.values(snapshot.data());
                //         console.log("Document data:", mapData);
                //         const murl1 = mapData.sort((b, c) => c.id - b.id);
                //         const murl3 = murl1.sort((b, c) => c.star_rating - b.star_rating);
                //         setClaimed(murl3);
                //     } else {
                //         // doc.data() will be undefined in this case
                //         console.log("No such document!");
                //     }
                // });




                const docRef = await db.collection("User").doc(currentUid).collection("Favourites").doc("Series").collection("ratings").get();
                // const snap = onSnapshot(docRef, (snapshot) => {
                //     console.log("Lol")
                // })
                let docSnap = Object.values(docRef.docs.map(doc => doc.data()[doc.id]));
                const murl1 = docSnap.sort((b, c) => c.id - b.id);
                const murl3 = murl1.sort((b, c) => c.star_rating - b.star_rating);
                setClaimed(murl3)
                // let docSnap = await getDocs(docRef);
                // onSnapshot(docSnap, (snapshot) => {
                //     if (snapshot.exists()) {
                //         let mapData = Object.values(snapshot.data());
                //         console.log("Document data:", mapData);
                //         const murl1 = mapData.sort((b, c) => c.id - b.id);
                //         const murl3 = murl1.sort((b, c) => c.star_rating - b.star_rating);
                //         setClaimed(murl3);
                //     } else {
                //         // doc.data() will be undefined in this case
                //         console.log("No such document!");
                //     }
                // });











                //Get current profiles followed
                if (currentUser) {
                    db.collection("Following").doc(currentUser.uid).collection("UserFollowing").where(documentId(), "==", currentUid).onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            setIsFollowing(true);
                            console.log("Following"); // For doc name
                        });
                    });
                }

                const snapshot = await db.collection('Following').doc(currentUid).collection("UserFollowing").get()
                const followingMurloc = snapshot.docs.map(doc => doc.id);
                db.collectionGroup("UserFollowing").where("uid", "==", currentUid).onSnapshot((querySnapshot) => {
                    querySnapshot.forEach(async doc => {
                        const murlocs = (doc.ref.path.replace('Following/', '').replace(`/UserFollowing/${currentUid}`, ''));
                        const murlocsUsername = await db.collection("User").doc(murlocs).get();
                        setFollowers(prevFollowed => prevFollowed.concat(murlocsUsername.data()));
                    });
                });

                followingMurloc.forEach(async murloc => {
                    const qk = await db.collection('User').doc(murloc).get();
                    console.log(qk.data().Username);
                    setFollowed(prevFollowed => prevFollowed.concat(qk.data()));
                });

                const usersReference = collection(db, "Posts", (currentUid), "userPosts", "Logs", "logSeries");
                const qkn = query(usersReference, orderBy("review.dateseconds", "desc"));
                const usersReferencePost = collection(db, "Posts", (currentUid), "userPosts", "Logs", "postSeries");
                const qknPost = query(usersReferencePost, orderBy("review.dateseconds", "desc"));
                const qreturn = await getDocs(qkn)
                const qreturnPost = await getDocs(qknPost)
                const followingMurlocq = qreturn.docs.map(doc => doc.data());
                const followingMurlocqPost = qreturnPost.docs.map(doc => doc.data());
                setRecentSeries(followingMurlocq.concat(followingMurlocqPost).sort((b, c) => parseFloat(c.review.dateseconds) - parseFloat(b.review.dateseconds)).slice(0, 4));

                const usersReferenceSeason = collection(db, "Posts", (currentUid), "userPosts", "Logs", "logSeason");
                const qknSeason = query(usersReferenceSeason, orderBy("review.dateseconds", "desc"), limit(4));
                const qreturnSeason = await getDocs(qknSeason)
                const followingMurlocqSeason = qreturnSeason.docs.map(doc => doc.data());
                setRecentSeason(followingMurlocqSeason);

                const usersReferenceEpisode = collection(db, "Posts", (currentUid), "userPosts", "Logs", "logEpisode");
                const qknEpisode = query(usersReferenceEpisode, orderBy("review.dateseconds", "desc"), limit(8));
                const qreturnEpisode = await getDocs(qknEpisode)
                const followingMurlocqEpisode = qreturnEpisode.docs.map(doc => doc.data());
                setRecentEpisode(followingMurlocqEpisode);
            }

            currentUser && db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getUsers();
    }, [currentUser, profileId, currentUid]);


    console.log(recentSeries);

    async function changeRating(newRating, name) {
        const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Series", "ratings", (claimed[name].name).replaceAll('-', ' ')) : null;
        const starrating = { star_rating: newRating }
        Object.assign(claimed[name], starrating, { user: username });
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
            <div className="flex w-screen justify-center mt-24">
                <div className="w-screen flex max-w-4xl">
                    <div className="flex justify-between dark:text-white font-semibold text-3xl w-full relative mb-4">
                        <h1>{profileId}</h1>
                        
                        {(currentUser && (currentUid === currentUser.uid)) && <button onClick={handleLogout}>Log Out</button>}
                    </div>
                    {(currentUser && (currentUid !== currentUser.uid)) &&
                        <button className="dark:text-white font-semibold bg-green-400 rounded shadow p-3 text-sm hover:bg-green-500"
                            onClick={() =>
                                isFollowing ?
                                    unfollowFunction() :
                                    followFunction()
                            }
                        >
                            {isFollowing ? <h1>Unfollow</h1> : <h1>Follow</h1>}</button>}</div></div>
            <div className=" w-screen flex justify-center relative">
                <div className=" w-full max-w-5xl min-h-screen h-auto dark:bg-letterboxd-bg flex justify-center">
                    <div className=" dark:text-white font-semibold text-3xl flex flex-col">
                        <div className=" mt-4 max-w-2xl">
                            <Link to={`/${username}/activity/episode`} className="text-white font-semibold text-xl">Recent Episode Activity</Link>
                            <div className="border-t border-white mb-1"></div>
                            <ul className="flex flex-wrap justify-center md:justify-start">
                                {recentEpisode.map((recentClaims, index) => (
                                    <div className="flex flex-col items-center mx-1 my-1">
                                        <Link to={`/${recentClaims.review.seriesname && (recentClaims.review.seriesname).replace(/\s/g, '-')}/season-${recentClaims.review.season_number}/episode/${recentClaims.review.episode_number}`}>
                                            <img src={`https://image.tmdb.org/t/p/original${recentClaims.review.still_path}`} alt="" className=" w-40 rounded border-white border" />
                                        </Link>
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
                        <div className=" mt-4 max-w-2xl">
                            <Link to={`/${username}/activity/season`} className="text-white font-semibold text-xl">Recent Season Activity</Link>
                            <div className="border-t border-white mb-1"></div>
                            <ul className="flex flex-wrap justify-center md:justify-start">
                                {recentSeason.map((recentClaims, index) => (
                                    <div className="flex flex-col items-center mx-1 my-1">
                                        <Link to={`/${recentClaims.review.seriesname && (recentClaims.review.seriesname).replace(/\s/g, '-')}/season-${recentClaims.review.season_number}/episodes`}>
                                            <img src={`https://image.tmdb.org/t/p/original${recentClaims.review.poster_path}`} alt="" className=" w-40 rounded border-white border" />
                                        </Link>
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
                        <div className=" mt-4 max-w-2xl">
                            <Link to={`/${username}/activity/series`} className="text-white font-semibold text-xl">Recent Series Activity</Link>
                            <div className="border-t border-white mb-1"></div>
                            <ul className="flex flex-wrap justify-center md:justify-start">
                                {recentSeries.map((recentClaims, index) => (
                                    <div className="flex flex-col items-center mx-1 my-1">
                                        <Link to={recentClaims.review.review === undefined ? `/series/${(recentClaims.review.name).replace(/\s/g, '-')}` : `/${recentClaims.review.user}/${recentClaims.review.seriesname.replaceAll(' ', '-')}/${recentClaims.review.index}/`}>
                                            <img src={`https://image.tmdb.org/t/p/original${recentClaims.review.poster_path}`} alt="" className=" w-40 rounded border-white border" />
                                        </Link>
                                        <div className="flex items-center">
                                        {recentClaims.review.review !== undefined ? <GrTextAlignFull size={24} className=" mt-3 pr-1"/> : null}
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
                        {error}
                        <div className="mt-24">
                            <h1>All Series</h1>
                            <div>
                                <ul className="flex max-w-screen flex-wrap justify-center md:justify-start max-w-2xl">
                                    {claimed.map((claims, index) => (
                                        <div key={claims.id} className="flex flex-col items-center mx-1 my-1">
                                            <Link to={`/series/${(claims.name).replace(/\s/g, '-')}`}>
                                                <img src={`https://image.tmdb.org/t/p/original${claims.poster_path}`} alt="" className=" w-40 rounded border-white border" />
                                            </Link>
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
                        </div>
                    </div>
                    {/* FOLLOWING */}
                    <div className="flex h-screen text-white font-semibold text-xl border-t border-white mb-1">
                        <div className="flex space-x-8 max-w-max">
                            <div className=" flex flex-col">
                                Following {followed.length}
                                {followed.map((user) => (
                                    <ul key={user.Uid} className="list-none">
                                        <li>{user.Username}</li>
                                    </ul>
                                ))}
                            </div>
                            <div className=" flex flex-col">
                                <h1>Followers {followers.length}</h1>
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
                </div>
            </div>
        </>
    )
}

export default ProfilePage;