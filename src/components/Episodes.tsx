// @ts-nocheck

import { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useParams } from 'react-router-dom';
import { getEpisodesRequest, getSeasonsRequest, getSearchRequest, getEpisodeRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, query, collection, where, setDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';

function Episodes() {

    const { id, seasonId } = useParams();

    const { currentUser } = useAuth();

    const [season, setSeason] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [lolmurloc, setLolmurloc] = useState(0);
    const [isInFavourites, setIsInFavourites] = useState(false);
    const [postId, setPostId] = useState(makeid(9));
    const [reviewInput, setReviewInput] = useState(false);
    const [reviewQuery, setQuery] = useState("");
    const [username, setUsername] = useState([]);
    const [minusNumber, setMinusNumber] = useState(1);
    const [succession, setSuccession] = useState("")

    useEffect(() => {
        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            setSuccession(seriesList[0].backdrop_path);
            const seasonList = await getSeasonsRequest(seriesList[0].id);
            if (seasonList[0].name === "Specials") { setMinusNumber(0) }
            setSeason(seasonList);
            console.log(seasonList);

            const episodeList = await getEpisodesRequest(seriesList[0].id, seasonId);
            console.log(episodeList);
            setEpisodes(episodeList);

            const episodeLoreList = await getEpisodeRequest(seriesList[0].id, seasonId, 1);
            console.log(episodeLoreList);

            const citiesRef = collection(db, "User");
            const q = query(citiesRef, where("loka", "==", true));
            console.log(q);

            currentUser && db.collection("User").doc(currentUser.uid).collection("Favourites").doc("Season").get().then(doc => {
                if (doc.data()) {
                    setIsInFavourites(true);
                    if (doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - minusNumber].name]) {
                        if (doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - minusNumber].name]["star_rating"]) {
                            console.log(doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - minusNumber].name]["star_rating"]);
                            setLolmurloc(doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - minusNumber].name]["star_rating"]);
                        }
                    }
                }
                else {
                    setIsInFavourites(false);
                    setLolmurloc(0);
                    console.log("lol");
                }
            });

            currentUser && db.collection("User").doc(currentUser.uid).get().then(doc => {
                setUsername(doc.data().Username);
            });
        }

        getSeriesRequest();
    }, [currentUser, id, seasonId]);

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

    const userDocumentFav = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Season") : null;
    
    async function addSeason(murlocSeason, starrating) {
        setPostId(makeid(9));
        let date = Date().toLocaleLowerCase();
        Object.assign(murlocSeason, starrating, { date: date }, {user: username});
        const logRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "logSeason", postId) : null;
        await setDoc(logRefMurlocMrrrglUpdate, {
            review: murlocSeason,
            date: date,
        });
    }

    async function addReviewSeason(reviewText, starrating, murloc, seasonName) {
        setPostId(makeid(9));
        const reviewRefUpdated = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' ') + " " + seasonName, "post", postId);
        const reviewRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "postSeason", postId) : null
        let date = Date().toLocaleLowerCase();
        Object.assign(murloc, { review: reviewText }, { star_rating: starrating }, { user: username }, { postId: postId }, { date: date }, { fullName: id.replaceAll('-', ' ') + " " + seasonName }, {seriesname: id.replaceAll('-', ' ')});

        await setDoc(reviewRefUpdated, {
            user: username,
            review: reviewText,
            starrating: starrating,
            comments: { username: "Username" },
            likes: 3,
            reviewId: postId,
            date: date,
        });

        await setDoc(reviewRefMurlocMrrrglUpdate, {
            review: murloc
        });
    }

    async function changeRating(newRating, name) {
        setLolmurloc(newRating);
        Object.assign(season[seasonId - minusNumber], { star_rating: newRating });
        console.log(season[seasonId - minusNumber]);
        if ((season[seasonId - minusNumber].name).includes(".")) {
            (season[seasonId - minusNumber].name) = (season[seasonId - minusNumber].name).replace(/\./g, '');
            console.log(season[seasonId - minusNumber].name);
        }

        if (isInFavourites) {
            await updateDoc(userDocumentFav, {
                [id.replaceAll('-', ' ') + " " + season[seasonId - minusNumber].name]:
                    season[seasonId - minusNumber],
            });
        } else {
            await setDoc(userDocumentFav, {
                [id.replaceAll('-', ' ') + " " + season[seasonId - minusNumber].name]:
                    season[seasonId - minusNumber],
            });
        }

        // await setDoc(starsRef, {

        // })
    }

    async function deleteRating() {
        setLolmurloc(0);
        if (isInFavourites) {
            await updateDoc(userDocumentFav, {
                [id.replaceAll('-', ' ') + " " + season[seasonId - minusNumber].name]:
                    deleteField(),
            });
        } else {
            await setDoc(userDocumentFav, {
                [id.replaceAll('-', ' ') + " " + season[seasonId - minusNumber].name]:
                    deleteField(),
            });
        }
    }

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);
    }

    console.log(season[seasonId - minusNumber])

    return (
        <>
            <div className="w-screen bg-gray-800 text-white font-semibold">
                <Link to="/">
                    {
                        season[seasonId - minusNumber] && season[seasonId - minusNumber].name}
                </Link>
                <div className="flex">
                    <div className="flex flex-col">
                        <div>
                            <Link to={{
                                pathname: `/series/${id}`,
                            }}>
                                <img className="w-96 rounded" src={`https://image.tmdb.org/t/p/original${season[seasonId - minusNumber] && season[seasonId - minusNumber].poster_path}`} alt="" />
                            </Link>
                        </div>
                        <div className="p-1">
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
                        </div>
                        <div className="flex space-x-1">
                            <button className=" w-32 h-12 bg bg-green-500 rounded shadow hover:bg-green-600 dark:text-white font-semibold mt-2"
                                onClick={() => addSeason(season[seasonId - minusNumber], { star_rating: lolmurloc })}
                            >Logga</button>
                            <div onClick={() => setReviewInput(!reviewInput)} className="bg-green-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-green-600">
                            </div>
                        </div>
                        {reviewInput ?
                            <div>
                                <input className=" absolute text-black" type="text" value={reviewQuery} onChange={onChange} />
                                <div onClick={() => addReviewSeason(reviewQuery, lolmurloc, season[seasonId - minusNumber], season[seasonId - minusNumber].name)} className="bg-red-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-green-600 absolute">
                                    <h1>Review</h1>
                                </div>
                            </div> : null}
                    </div>
                    <p>{season[seasonId - minusNumber] && season[seasonId - minusNumber].overview}</p>
                </div>
            </div>
            {id} {seasonId}
            <div className=" w-screen flex flex-wrap">
                {
                    //onClick upp med meny kolla starrating
                    episodes.map((thingy, index) => (
                        <ul className="flex flex-wrap w-min">
                            <div className="flex flex-col items-center">
                                <Link to={{
                                    pathname: `/${id}/season-${seasonId}/episode/${thingy.episode_number}`,
                                }}>
                                    <li className="bg-black w-52 rounded mx-1 my-1 dark:text-white">
                                        <img className="rounded" src={thingy.still_path === null ? `https://image.tmdb.org/t/p/original${succession}` : `https://image.tmdb.org/t/p/original${thingy.still_path}`} alt={thingy.name}></img>
                                    </li>
                                    <h1 className="text-white font-semibold">{thingy.name}</h1>
                                </Link>
                            </div>
                        </ul>
                    ))
                }
            </div>
        </>
    )
}

export default Episodes;