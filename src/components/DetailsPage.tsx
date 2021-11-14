// @ts-nocheck

import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useParams } from 'react-router-dom';
import { getCreditsRequest, getSeasonsRequest, getSearchRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Tilt from 'react-parallax-tilt';
import ProgressBar from "@ramonak/react-progress-bar";
import LoginPage from './LoginPage';
import Review from './Review';

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
    const [reviews, setReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState(false);
    const [query, setQuery] = useState("");
    const [postId, setPostId] = useState(makeid(9))

    useEffect(() => {
        const getUsers = async () => {
            db.collection("User").doc(currentUser.uid).collection("Favourites").doc("Series").get().then(doc => {
                if (doc.data()) {
                    setIsInFavourites(true);
                    if (doc.data()[id.replaceAll('-', ' ')]) {
                        if (doc.data()[id.replaceAll('-', ' ')]["star_rating"]) {
                            console.log(doc.data()[id.replaceAll('-', ' ')]["star_rating"]);
                            setLolmurloc(doc.data()[id.replaceAll('-', ' ')]["star_rating"]);
                        }
                    }
                }
                else {
                    setIsInFavourites(false);
                    setLolmurloc(0);
                    console.log("lol");
                }
            });

            db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            setSuccession(seriesList[0]);
            console.log(seriesList[0]);

            const seasonList = await getSeasonsRequest(seriesList[0].id);
            setSeason(seasonList);
            console.log(seasonList);

            const castingList = await getCreditsRequest(seriesList[0].id);
            setCastList(castingList.cast);
            console.log(castingList);


            const snapshot = await db.collection("Posts").doc(id.replaceAll('-', ' ')).collection("userPosts").get();
            console.log(snapshot.docs.map(doc => doc.data()));
            setReviews(snapshot.docs.map(doc => doc.data()));

            // db.collection("Posts").doc(id.replaceAll('-', ' ')).collection("userPosts").doc(currentUser.uid).get().then(doc => {
            //     if (doc.data()) {
            //         setReviews(doc.data());
            //     }


            //     else {
            //         console.log("lol");
            //     }
            // });

            // db.collection("Posts").doc(seriesList[0].name).collection("userPosts").doc(currentUser.uid).get().then(doc => {
            //     setReviews(doc.data());
            //     console.log(doc.data());
            // });
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
    const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Series") : null;
    const reviewRef = currentUser ? doc(db, "Posts", id.replaceAll('-', ' ')
        //  + " " + makeid(9)
        , "userPosts", currentUser.uid) : null;
        const reviewRefMurloc = currentUser ? doc(db, "Posts", currentUser.uid) : null
        //  + " " + makeid(9)
        // , "userPosts", currentUser.uid) : null;
    const postRef = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", (id.replaceAll('-', ' ') + " " + postId)) : null;

    async function addEpisode(murloc, starrating) {
        Object.assign(murloc, starrating);
        console.log(murloc);
        if ((murloc.name).includes(".")) {
            (murloc.name) = (murloc.name).replace(/\./g, '');
            console.log(murloc.name);
        }
        // setFavourites([...favourites, murloc]);
        // console.log(favourites);

        if (isInFavourites) {
            await updateDoc(userDocumentFav, {
                [murloc.name]:
                    murloc,
                // deleteField(),
            });
        } else {
            await setDoc(userDocumentFav, {
                [murloc.name]:
                    murloc,
                // deleteField(),
            });


        }
    }

    async function addReview(reviewText, starrating, murloc) {
        setPostId(makeid(9));
        Object.assign(murloc, {review: reviewText}, {star_rating: starrating}, {user: username});
        // await setDoc(reviewRef, {
        //     user: username,
        //     review: reviewText,
        //     starrating: starrating,
        //     // date: Timestamp.toDateTime().toString()
        // });

        

        if (isInFavourites) {
            await updateDoc(reviewRefMurloc, {
                [murloc.name]: murloc,
                // user: username,
                // review: reviewText,
                // starrating: starrating,
                // date: Timestamp.toDateTime().toString()
            });
        } else {
            await setDoc(reviewRefMurloc, {
                [murloc.name]: murloc,
                // user: username,
                // review: reviewText,
                // starrating: starrating,
                // date: Timestamp.toDateTime().toString()
            });


        }
    }

    function changeRating(newRating, name) {
        setLolmurloc(newRating);
    }

    for (let i = 1; i <= 20; i++) {
        seasonsLOL.push(
            season[i - 1] &&
            // (season[i - 1].name !== "Specials") ?
            <Link key={season[i - 1].id} to={{
                pathname: `/${id}/season-${season[i - 1].season_number}/episodes`,
            }}>
                <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
                    <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                        <img src={`https://image.tmdb.org/t/p/original${season[i - 1].poster_path}`} className=" rounded-t" alt={season[i - 1].name}></img>
                        <p className="text-center font-bold">{season[i - 1].name}</p>
                    </li>
                </Tilt>
            </Link>
            // : <div></div>
        )
    }

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);
    }

    return (
        <>
            {/* <Link to="/" className="font-semibold text-white text-xl">Dashboard</Link>
            <p className="text-white font-semibold">{id.replaceAll('-', ' ')}</p>
            <p className="text-white">{window.location.pathname}</p> */}
            <div className=" w-screen flex justify-center relative">
                <div className=" w-full max-w-6xl min-h-screen h-auto bg-letterboxd-bg flex">
                    <div className="flex flex-col items-center">
                        {inputClicked && <div className="absolute h-44 mt-0 z-50">
                            <div onClick={() => setInputClicked(false)} className="text-white font-semibold cursor-pointer">
                                x</div>
                            <LoginPage />
                        </div>}
                        <div className="w-full relative -mt-16">
                            <div className=" bg-gradient-to-t via-transparent from-letterboxd-bg h-full w-full absolute"></div>
                            <div className=" bg-gradient-to- via-transparent from-letterboxd-bg h-full w-full absolute"></div>
                            <div className=" bg-gradient-to-l via-transparent from-letterboxd-bg h-full w-full absolute"></div>
                            <div className=" bg-gradient-to-r via-transparent from-letterboxd-bg h-full w-full absolute"></div>
                            <div className=" overflow-hidden h-extra-height">
                                <img src={`https://image.tmdb.org/t/p/original${succession.backdrop_path}`} alt={succession.name}></img>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col items-center">
                                <img src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} className="min-w-max max-w-min h-80 rounded m-1 border-gray-50 border shadow" alt={succession.name}></img>
                                {currentUser && <StarRatings
                                    rating={lolmurloc}
                                    starRatedColor="#f59e0b"
                                    numberOfStars={5}
                                    starDimension="24px"
                                    starSpacing="1px"
                                    changeRating={changeRating}
                                    name="rating"
                                    starHoverColor="#f59e0b"
                                />}
                                <div className="flex space-x-1">
                                    {currentUser ? <button className=" w-32 h-12 bg bg-green-500 rounded shadow hover:bg-green-600 text-white font-semibold mt-2"
                                        onClick={() => addEpisode(succession, { star_rating: lolmurloc })}
                                    >Logga</button> : <button className=" w-32 h-12 bg bg-green-500 rounded shadow hover:bg-green-600 text-white font-semibold mt-2"
                                        onClick={() => setInputClicked(true)}
                                    >Logga in</button>}
                                    <div onClick={() => setReviewInput(!reviewInput)} className="bg-green-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-green-600"></div>
                                </div>
                                {reviewInput ?
                                    <div>
                                        <input className=" absolute" type="text" value={query} onChange={onChange} />
                                        <div onClick={() => addReview(query, lolmurloc, succession)} className="bg-red-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-green-600 absolute">
                                            <h1>Review</h1>
                                        </div>
                                    </div> : null}

                                {/* <Timeline>
  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot color="secondary" />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>{succession.first_air_date}</TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot color="success" />
    </TimelineSeparator>
    <TimelineContent>{succession.name}</TimelineContent>
  </TimelineItem>
</Timeline> */}
                            </div>
                            <div className="flex flex-col max-w-4xl">
                                <h1 className=" text-gray-300 font-semibold p-4 text-xl">{succession.name}</h1>
                                <p className=" text-gray-300 font-semibold pb-4 pl-4 pr-4">{succession.overview}</p>
                                <ProgressBar completed={60} className="w-44" />
                                <div>
                                    {
                                        castList.filter(Boolean).map((thingy, index) => (
                                            <div className="flex flex-col items-center">
                                                <Link to={{
                                                    pathname: `/actor/${(thingy.name).replace(/\s/g, '-')}`,
                                                }}>
                                                    <h1 className="text-white font-semibold min-w-max">{thingy.name} - {thingy.character}</h1>
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="flex justify-center">
                                    <ul className="bg-white max-w-xl w-screen rounded shadow mt-16 p-1">
                                        {reviews.length !== 0 ?<div>
                                            <div className="flex justify-end">
                                                <Link to={{
                                                    pathname: `/reviews/${id.replace(/\s/g, '-')}`,
                                                }}>More Reviews</Link>
                                            </div>
                                            {
                                                reviews.map((thingy) => (
                                                    <Review user={thingy.user} review={thingy.review} stars={thingy.starrating}></Review>
                                                ))}
                                        </div>: <h1>Be the first one to leave a review!</h1>}
                                    </ul>

                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex flex-col items-center">
                                    {/* <h1 className="font-semibold text-xl text-gray-300">Seasons</h1> */}
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