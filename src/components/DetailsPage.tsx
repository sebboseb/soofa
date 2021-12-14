// @ts-nocheck

import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useParams } from 'react-router-dom';
import { getCreditsRequest, getSeasonsRequest, getSearchRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, deleteDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import LoginPage from './LoginPage';
import Review from './Review';
import { FaCommentAlt } from 'react-icons/fa';
import { BsHeart, BsHeartFill, BsEye, BsEyeFill, BsCollection, BsCollectionFill } from 'react-icons/bs';
import Chart from "react-google-charts";

function DetailsPage() {

    const { id } = useParams();
    const { currentUser } = useAuth();
    const [season, setSeason] = useState(6);
    const [castList, setCastList] = useState([]);
    const seasonsLOL = [];
    const [succession, setSuccession] = useState([]);
    const [lolmurloc, setLolmurloc] = useState(0);
    const [isInFavourites, setIsInFavourites] = useState(false);
    const [username, setUsername] = useState([]);
    const [inputClicked, setInputClicked] = useState(false);
    // const [reviews, setReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState(false);
    const [query, setQuery] = useState("");
    const [postId, setPostId] = useState(makeid(9));
    const [crewList, setCrewList] = useState([]);
    const [reviewsUpdate, setReviewsUpdate] = useState([]);
    const [hasSpecial, setHasSpecial] = useState(false);
    const [friendsRatings, setFriendsRatings] = useState([]);
    const [style, setStyle] = useState({ display: 'none' });
    const [ratings, setRatings] = useState(0);
    const [stars, setStars] = useState([]);
    const [likedSeries, setLikedSeries] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    // const [average, setAverage] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setFriendsRatings([]);
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).collection("Favourites").doc("Series").collection("ratings").doc(id.replaceAll('-', ' ')).get().then(doc => {
                if (doc.data()) {
                    if (doc.data()[id.replaceAll('-', ' ')]) {
                        setIsInFavourites(true);
                        if (doc.data()[id.replaceAll('-', ' ')]["star_rating"]) {
                            console.log(doc.data()[id.replaceAll('-', ' ')]["star_rating"]);
                            setLolmurloc(doc.data()[id.replaceAll('-', ' ')]["star_rating"]);
                        }
                    }
                    // const likedSnapshot = await db.collection('User').doc(currentUser.uid).collection("Favourites").doc("Series").collection("ratings").doc(id.replaceAll('-', ' ')).get();
                    // console.log(likedSnapshot.data()[id.replaceAll('-', ' ')]['liked']);
                    setLikedSeries(doc.data()[id.replaceAll('-', ' ')]['liked']);
                }
                else {
                    setIsInFavourites(false);
                    setLolmurloc(0);
                    console.log("lol");
                }
            });

            db.collection("Posts").doc("Reviews").collection("userPosts").doc(id.replaceAll('-', ' ')).collection("ratings").doc("5").get().then(doc => {
                if (doc.exists) {
                    console.log("hasData");
                }
                else {
                    setNewRatings();
                }
            });

            db.collection("User").doc(currentUser.uid).collection("Watchlist").doc("Series").collection("ratings").doc(id.replaceAll('-', ' ')).get().then(doc => {
                if (doc.exists) {
                    console.log("In watchlist");
                    setIsInWatchlist(true);
                }
                else {
                    console.log("Not in watchlist");
                    setIsInWatchlist(false);
                }
            });

            // db.collection("Posts").doc(currentUser.uid).get().then(doc => {
            //     if (doc.data()) {
            //         setIsInFavourites(true);
            //     }
            //     else {
            //         setIsInFavourites(false);
            //     }
            // });

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });

            const friendSnapshot = await db.collection('Following').doc(currentUser.uid).collection("UserFollowing").get();
            const friendMurloc = friendSnapshot.docs.map(doc => doc.id);
            console.log(friendMurloc);

            friendMurloc.forEach(async murloc => {
                const friendRating = await db.collection('User').doc(murloc).collection("Favourites").doc("Series").collection(`ratings`).doc(id.replaceAll('-', ' ')).get();
                // let murlocdata = Object.values(friendRating.docs.map(doc => doc.data()));
                // console.log(friendRating.data()[id.replaceAll('-', ' ')]['star_rating'])
                if (friendRating.data()) {
                    setFriendsRatings(prevFollowed => prevFollowed.concat(friendRating.data()[id.replaceAll('-', ' ')]
                        // ['star_rating']
                    ));
                }
            });
        }

        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            setSuccession(seriesList[0]);
            console.log(seriesList[0]);

            const seasonList = await getSeasonsRequest(seriesList[0].id);
            if (seasonList[0].name === "Specials") { setHasSpecial(true) }
            setSeason(seasonList);
            console.log(seasonList);

            const castingList = await getCreditsRequest(seriesList[0].id);
            setCastList(castingList.cast);
            setCrewList(castingList.crew);
            console.log(castingList);
            console.log(castingList.crew);

            // const snapshot = await db.collection("Posts").doc("Reviews").collection("userPosts").doc(id.replaceAll('-', ' ')).get();
            // if (snapshot.data()) {
            //     console.log(snapshot.data());
            //     let murlocdata = Object.values(snapshot.data());
            //     const murl = murlocdata.sort((b, c) => b.date - c.date);
            //     setReviews(murl);
            //     // setReviews(snapshot.docs.map(doc => doc.data()));
            // }

            const qk = await db.collection('Posts').doc(id).collection("userPosts").doc("Logs").get();
            console.log(qk.data());

            const snapshotqk = await db.collection('Posts').doc("Reviews").collection("userPosts").doc(id.replaceAll('-', ' ')).collection("postSeries").get()
            const followingMurloc = snapshotqk.docs.map(doc => doc.data());
            // const jenny = followingMurloc.sort((b, c) => c.date.localeCompare(b.date));
            const jenny = followingMurloc.sort((b, c) => parseFloat(c.dateNumbers) - parseFloat(b.dateNumbers));
            console.log(jenny);
            setReviewsUpdate(jenny);

            const starsSnapshot = await db.collection('Posts').doc("Reviews").collection("userPosts").doc(id.replaceAll('-', ' ')).collection("ratings").get();
            // const stars = starsSnapshot.docs.map(doc => (doc.id + ":" + doc.data()["rating"] + " "));
            setStars(starsSnapshot.docs.map(doc => (doc.data()["rating"])));
            const starsTotal = starsSnapshot.docs.map(doc => (parseInt(doc.id) * doc.data()["rating"])).reduce((b, c) => b + c, 0);
            const starsAverage = starsSnapshot.docs.map(doc => (doc.data()["rating"])).reduce((b, c) => b + c, 0);
            // console.log(stars);
            // console.log("average:" + starsAverage);
            // console.log("total:" + starsTotal);
            // console.log(starsTotal / starsAverage);
            let star = (starsTotal / starsAverage)
            star && setRatings(star);

            // const likedSnapshot = await db.collection('User').doc(currentUser.uid).collection("Favourites").doc("Series").collection("ratings").doc(id.replaceAll('-', ' ')).get();
            // // console.log(likedSnapshot.data()[id.replaceAll('-', ' ')]['liked']);
            // setLikedSeries(likedSnapshot.data()[id.replaceAll('-', ' ')]['liked']);
        }

        currentUser && getUsers();
        getSeriesRequest();
    }, [id, currentUser]);

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

    //getstars if namn (id) matchar firebase get star rating annars gör ny star rating
    // const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Series") : null;
    const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Series", "ratings", id.replaceAll('-', ' ').replace(/\./g, '')) : null;
    const userDocumentWatchlist = currentUser ? doc(db, "User", currentUser.uid, "Watchlist", "Series", "ratings", id.replaceAll('-', ' ').replace(/\./g, '')) : null;

    async function addEpisode(murloclog, starrating) {
        setPostId(makeid(9));
        let date = Date().toLocaleLowerCase();
        let datelol = new Date();
        Object.assign(murloclog, starrating,
            { dateseconds: datelol.getTime() / 360000 },
            { user: username },
            { date: date },
            { index: reviewsUpdate.filter(x => x.user === username).length.toString() },
            { liked: likedSeries }
        );
        const logRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "logSeries", postId) : null;
        await setDoc(logRefMurlocMrrrglUpdate, {
            review: murloclog,
        });
    }

    async function addReview(reviewText, starrating, murloc) {
        //add index
        setPostId(makeid(9));
        const reviewRefUpdated = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "postSeries", postId);
        const reviewRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "postSeries", postId) : null
        let date = Date().toLocaleLowerCase();
        let datelol = new Date();
        Object.assign(murloc,
            { review: reviewText },
            { star_rating: starrating },
            { user: username },
            { postId: postId },
            { date: date },
            { seriesname: id.replaceAll('-', ' ') },
            { dateseconds: datelol.getTime() / 360000 },
            { index: reviewsUpdate.filter(x => x.user === username).length.toString() },
            { liked: likedSeries }
        );

        await setDoc(reviewRefUpdated, {
            user: username,
            review: reviewText,
            starrating: starrating,
            likes: [],
            comments: [],
            reviewId: postId,
            date: date,
            dateNumbers: datelol.getTime() / 360000,
            seriesname: id.replaceAll('-', ' '),
            index: reviewsUpdate.filter(x => x.user === username).length.toString(), //index === reviews where(username == sebboseb).length + 1
            liked: likedSeries,
        });

        await setDoc(reviewRefMurlocMrrrglUpdate, {
            review: murloc,
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

    async function changeRating(newRating, name) {

        // if (newRating !== lolmurloc) {

        const starsRef = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "ratings", newRating.toString());
        const starsRefOld = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "ratings", lolmurloc.toString());

        setLolmurloc(newRating);
        Object.assign(succession, { star_rating: newRating }, { user: username });
        console.log(succession);
        if ((succession.name).includes(".")) {
            (succession.name) = (succession.name).replace(/\./g, '');
            console.log(succession.name);
        }

        setIsInFavourites(true);
        await setDoc(userDocumentFav, {
            [succession.name]:
                succession,
        });

        await updateDoc(starsRef, {
            rating: increment(1)
        });

        await updateDoc(starsRefOld, {
            rating: increment(-1)
        });
        // }
    }

    async function deleteRating() {
        setLolmurloc(0);
        if (isInFavourites) {
            await deleteDoc(userDocumentFav);
            setIsInFavourites(false);
        }
    }

    if (hasSpecial) {
        for (let i = 0; i <= season.length; i++) {
            (season[i] && (season[i].name !== "Specials")) &&
                seasonsLOL.push(
                    <Link key={season[i].id} to={{
                        pathname: `/${id}/season-${i}/episodes`,
                    }}>
                        {/* <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}> */}
                        <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white border border-white">
                            <img src={season[i].poster_path !== null ? `https://image.tmdb.org/t/p/original${season[i].poster_path}` : `https://image.tmdb.org/t/p/original${succession.poster_path}`} className=" rounded" alt={season[i].name}></img>
                        </li>
                        {/* </Tilt> */}
                    </Link>
                )
        }
    } else {
        for (let i = 0; i <= season.length + 1; i++) {
            season[i - 1] &&
                seasonsLOL.push(
                    <Link key={season[i - 1].id} to={{
                        pathname: `/${id}/season-${season[i - 1].season_number}/episodes`,
                    }}>
                        {/* <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}> */}
                        <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white border border-white">
                            <img src={season[i - 1].poster_path !== null ? `https://image.tmdb.org/t/p/original${season[i - 1].poster_path}` : `https://image.tmdb.org/t/p/original${succession.poster_path}`} className=" rounded" alt={season[i - 1].name}></img>
                        </li>
                        {/* </Tilt> */}
                    </Link>
                )
        }
    }

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);
    }

    async function likeReview(reviewId, likeCount) {
        const likeReviewref = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "postSeries", reviewId);
        await updateDoc(likeReviewref, {
            likes: arrayUnion({ user: username }),
            // increment(1),
        });
    }

    async function deleteLike(reviewId) {
        const likeReviewref = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "postSeries", reviewId);
        await updateDoc(likeReviewref, {
            likes: arrayRemove({ user: username }),
            // increment(1),
        });
    }

    async function setNewRatings() {
        for (let i = 1; i <= 5; i++) {
            const starsRefFirst = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' '), "ratings", (i).toString());
            setDoc(starsRefFirst, {
                rating: 0
            })
        }
    }

    async function likeSeries() {
        if (!isInFavourites) {
            changeRating(0);
        }

        if (!likedSeries) {
            setLikedSeries(true);
            await setDoc(userDocumentFav, {
                [succession.name]:
                    { liked: true }
            }, { merge: true });
        } else {
            setLikedSeries(false);
            await setDoc(userDocumentFav, {
                [succession.name]:
                    { liked: false }
            }, { merge: true });
        }
    }

    async function addToWatchlist() {
        let date = Date().toLocaleLowerCase();
        let datelol = new Date();
        Object.assign(succession, { date: date },
            { dateseconds: datelol.getTime() / 360000 },)
        if (!isInWatchlist) {
            await setDoc(userDocumentWatchlist, {
                [succession.name]:
                    succession,
            });
            setIsInWatchlist(true);
        } else {
            await deleteDoc(userDocumentWatchlist);
            setIsInWatchlist(false);
        }
    }

    return (
        <>
            <div className=" w-screen flex justify-center relative">
                <div className=" w-full max-w-6xl min-h-screen h-auto dark:bg-letterboxd-bg flex">
                    <div className="flex flex-col items-center">
                        {inputClicked && <div className="absolute h-44 mt-0 z-50">
                            <div onClick={() => setInputClicked(false)} className="text-white font-semibold cursor-pointer">
                                x</div>
                            <LoginPage />
                        </div>}
                        <div className="w-full relative -mt-24">
                            <div className=" bg-gradient-to-t dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                            <div className=" bg-gradient-to-l dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                            <div className=" bg-gradient-to-r dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                            <div className=" bg-gradient-to- dark:via-transparent via-transparent dark:from-letterboxd-bg from-youtube-white-bg h-full w-full absolute"></div>
                            <div className=" overflow-hidden h-extra-height">
                                <img src={`https://image.tmdb.org/t/p/original${succession.backdrop_path}`} alt={succession.name}></img>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col items-center">
                                <div className=" sticky top-10 flex flex-col items-center">
                                    <img src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} className="min-w-max max-w-min h-80 rounded m-1 border-gray-50 border shadow in" alt={succession.name}></img>
                                    <div className="flex flex-col bg-gray-800 rounded items-center w-poster-width p-3 mt-2 shadow">
                                        {currentUser &&
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center justify-center gap-x-7 cursor-pointer">
                                                    {
                                                        isInFavourites ?
                                                            <div className=" mt-1">
                                                                <BsEyeFill size={35} color={"#35A7FF"} onClick={() => deleteRating()} className="text-white"></BsEyeFill></div> :
                                                            <BsEye size={35} onClick={() => changeRating(0)} className="text-white mt-1"></BsEye>
                                                    }
                                                    {
                                                        likedSeries ?
                                                            <div className=" mt-1">
                                                                <BsHeartFill size={30} color={"#f59e0b"} onClick={() => likeSeries()} className="text-white"></BsHeartFill></div> :
                                                            <BsHeart onClick={() => likeSeries()} size={35} className="text-white mt-1"></BsHeart>
                                                    }
                                                    {
                                                        isInWatchlist ?
                                                            <div className=" mt-1">
                                                                <BsCollectionFill size={35} onClick={() => addToWatchlist()} className="text-white"></BsCollectionFill></div> :
                                                            <BsCollection onClick={() => addToWatchlist()} size={35} className="text-white mt-1"></BsCollection>
                                                    }
                                                </div>
                                                <div onMouseEnter={e => {
                                                    setStyle({ display: 'block' });
                                                }}
                                                    onMouseLeave={e => {
                                                        setStyle({ display: 'none' })
                                                    }} className="flex items-center space-x-1 cursor-pointer border-t pt-3 border-gray-600 my-3 w-full justify-center">
                                                    <h1 style={style} className="text-white" onClick={() => changeRating(0)}>x</h1>
                                                    <StarRatings
                                                        rating={lolmurloc}
                                                        starRatedColor="#f59e0b"
                                                        numberOfStars={5}
                                                        starDimension="30px"
                                                        starSpacing="1px"
                                                        changeRating={changeRating}
                                                        name="rating"
                                                        starHoverColor="#f59e0b"
                                                    />
                                                </div>
                                            </div>
                                        }
                                        <div className={currentUser ? "flex space-x-1 border-t border-gray-600 pt-3" : "flex space-x-1 -mt-1"}>
                                            {currentUser ? <button className=" w-32 h-12 bg bg-soofa-orange rounded shadow hover:bg-yellow-600 dark:text-white font-semibold mt-2"
                                                onClick={() => addEpisode(succession, { star_rating: lolmurloc })}
                                            >Log</button> : <button className=" w-32 h-12 bg-soofa-orange rounded shadow hover:bg-yellow-600 dark:text-white font-semibold mt-2"
                                                onClick={() => setInputClicked(true)}
                                            >Log in</button>}
                                            <div onClick={() => setReviewInput(!reviewInput)} className="bg-soofa-orange w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-yellow-600"></div>
                                        </div>
                                    </div>
                                    <h1 className=" text-white border-b mt-3 pb-0.5 border-gray-400 w-poster-width">Ratings</h1>
                                    <div className="flex items-end gap-1 mt-3 ">
                                        <StarRatings
                                            rating={1}
                                            starRatedColor="#f59e0b"
                                            numberOfStars={1}
                                            starDimension="12px"
                                            starSpacing="1px"
                                            changeRating={""}
                                            name="rating"
                                            starHoverColor="#f59e0b"
                                        />
                                        {
                                            stars.length !== 0 && <Chart
                                                width={90}
                                                height={45}
                                                chartType="ColumnChart"
                                                loader={<div>Loading Chart</div>}
                                                data={[
                                                    ["Number", "Amount"],
                                                    ["1", stars[0]],
                                                    ["2", stars[1]],
                                                    ["3", stars[2]],
                                                    ["4", stars[3]],
                                                    ["5", stars[4]]
                                                ]}
                                                options={{
                                                    chartArea: {
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0
                                                    },
                                                    enableInteractivity: false,
                                                    title: 'Ratings',
                                                    colors: ["#696969"],
                                                    backgroundColor: '#14181C',
                                                    bar: { groupWidth: "95%" },
                                                    hAxis: {
                                                        title: 'Ratings',
                                                        minValue: 0,
                                                    },
                                                    vAxis: {
                                                        ticks: [],
                                                        title: 'Amount',
                                                    },
                                                }}
                                            />
                                        }
                                        <div className="flex flex-col items-center mt-3">
                                            <h1 className="text-white -mb-3">{ratings.toFixed(1)}</h1>
                                            <StarRatings
                                                rating={5}
                                                starRatedColor="#f59e0b"
                                                numberOfStars={5}
                                                starDimension="10px"
                                                starSpacing="0px"
                                                changeRating={""}
                                                name="rating"
                                                starHoverColor="#f59e0b"
                                            />
                                        </div>
                                    </div>
                                    <div className=" flex flex-col text-white">
                                        {/* {ratings !== 0 ? Object.values(ratings).reduce((b, c) => b + c) : null}
              <h1>{Object.keys(ratings)}</h1>
              <h1>{Object.entries(ratings)}</h1>
              <h1>1 4 9 36 25</h1>
              <h1>75</h1>
              <h1>75/20</h1>
              <h1>3,75</h1> */}
                                    </div>
                                    {reviewInput ?
                                        <div>
                                            <input className=" absolute" type="text" value={query} onChange={onChange} />
                                            <div onClick={() => addReview(query, lolmurloc, succession)} className="bg-red-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-yellow-600 absolute">
                                                <h1>Review</h1>
                                            </div>
                                        </div> : null}
                                </div>
                            </div>
                            <div className="flex flex-col max-w-4xl px-14">
                                <div className="flex items-end flex-wrap">
                                    <div className="flex gap-x-3 items-end flex-wrap mb-7 max-w-lg">
                                        <h1 className=" dark:text-white font-semibold mt-1 text-3xl">{succession.name}</h1>
                                        <h1 className=" dark:text-gray-500 font-semibold text-md"><u>{succession.first_air_date && succession.first_air_date.split('-')[0]}</u></h1>
                                        {
                                            (crewList.filter(kuk => kuk.department === 'Directing')).map((directors) => (

                                                <Link className="whitespace-nowrap" to={{
                                                    pathname: `/director/${(directors.name).replace(/\s/g, '-')}`,
                                                }}>
                                                    <span className="hover:text-gray-300 cursor-pointer text-white"><u>{directors.name}</u>&nbsp;</span>
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </div>
                                <p className=" dark:text-gray-300 font-semibold pb-4 max-w-xl">{succession.overview}</p>
                                <div className="flex max-w-3xl justify-center">
                                    <div className="flex flex-wrap max-w-xl w-screen mt-24 border-t border-white pt-8">
                                        {
                                            castList.filter(Boolean).map((thingy) => (
                                                <div className=" my-1 mx-1">
                                                    <Link to={{
                                                        pathname: `/actor/${(thingy.name).replace(/\s/g, '-')}`,
                                                    }}>
                                                        <h1 className="dark:text-white font-semibold min-w-max dark:bg-gray-500 bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 ease-linear transition-all duration-50 p-1 rounded">
                                                            {thingy.name} - <span className="text-gray-300">{thingy.character}</span>
                                                        </h1>
                                                    </Link>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    {(currentUser && (friendsRatings.length !== 0)) && <ul className="space-y-4 max-w-xl w-screen mt-16">
                                        <div className="flex justify-between dark:text-white">
                                            <h1>Friends Activity</h1>
                                            <Link to={{
                                                pathname: `/reviews/${id.replace(/\s/g, '-')}`,
                                            }}>
                                                <u>More Friends Activity</u>
                                            </Link>
                                        </div>
                                        <li className=" dark:text-white border-t dark:border-white border-black">
                                            <div className="flex justify-between mt-4">
                                                <div className="flex space-x-4 flex-wrap">
                                                    {friendsRatings.map((ratings) => (
                                                        <li>
                                                            <div className="flex flex-col items-center">
                                                                <Link to={`/${ratings.user}`} className="bg-gradient-to-br from-transparent via-green-300 to-blue-200 rounded-full w-12 h-12"><h1>{ratings.user}</h1></Link>
                                                                <StarRatings
                                                                    rating={ratings.star_rating}
                                                                    starRatedColor="#f59e0b"
                                                                    numberOfStars={5}
                                                                    starDimension="14px"
                                                                    starSpacing="0.3px"
                                                                    changeRating={null}
                                                                    name="rating"
                                                                    starHoverColor="#f59e0b"
                                                                />
                                                            </div>
                                                        </li>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    }
                                    <div className="flex justify-center">
                                        {reviewsUpdate.length !== 0 ?
                                            <ul className="space-y-4 max-w-xl w-screen mt-16">
                                                <div className="flex justify-between dark:text-white border-b border-white pb-2">
                                                    <h1>Popular Reviews</h1>
                                                    <Link to={{
                                                        pathname: `/reviews/${id.replace(/\s/g, '-')}`,
                                                    }}>
                                                        <u>More Reviews</u>
                                                    </Link>
                                                </div>
                                                {reviewsUpdate.map((thingy, index) => (
                                                    index <= 40 &&
                                                    <li className=" dark:text-white border-b dark:border-gray-600 border-black pb-1">
                                                        <div className="flex justify-between mt-4">
                                                            <div className="flex">
                                                                <div className="flex flex-col">
                                                                    <Review user={thingy.user} review={thingy.review} stars={thingy.starrating} series={thingy.seriesname} reviewIndex={thingy.index}></Review>
                                                                    <div className="flex items-center">
                                                                        <h1 className="cursor-pointer">
                                                                            {
                                                                                thingy.likes.find(user => user.user === username) ?
                                                                                    <BsHeartFill color={"#f59e0b"} onClick={() => deleteLike(thingy.reviewId)} />
                                                                                    : <BsHeart onClick={() => likeReview(thingy.reviewId, thingy.likes)}></BsHeart>
                                                                            }
                                                                        </h1>
                                                                        <h1 className="mb-1 ml-1">{thingy.likes && thingy.likes.length}</h1>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                {sortArray(thingy.date)}
                                                                <div className="flex justify-end mt-8">
                                                                    <Link to={`/${thingy.user}/${thingy.seriesname && (thingy.seriesname).replaceAll(' ', '-')}/${thingy.index}/`} className="flex items-center">
                                                                        <h1 className="mb-1 mr-1">{thingy.comments && thingy.comments.length}</h1>
                                                                        <FaCommentAlt />
                                                                    </Link></div>
                                                            </div>
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
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex flex-col items-center">
                                    <ul className=" list-none flex flex-col max-w-5xl flex-wrap">
                                        {seasonsLOL}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsPage;