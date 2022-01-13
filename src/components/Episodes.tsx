// @ts-nocheck

import { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useParams } from 'react-router-dom';
import { getEpisodesRequest, getSeasonsRequest, getSearchRequest, getEpisodeRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, query, collection, where, setDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import { BsHeart, BsHeartFill, BsEye, BsEyeFill, BsCollection, BsCollectionFill } from 'react-icons/bs';
import Chart from "react-google-charts";

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
    const [username, setUsername] = useState("");
    const [minusNumber, setMinusNumber] = useState(1);
    const [succession, setSuccession] = useState("");
    const [style, setStyle] = useState({ display: 'none' });
    const [ratings, setRatings] = useState(0);
    const [stars, setStars] = useState([]);
    const [likedSeries, setLikedSeries] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [services, setServices] = useState([]);

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
    }, [currentUser, id, seasonId, minusNumber]);

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
        let datelol = new Date();
        Object.assign(murlocSeason, starrating, { dateseconds: datelol.getTime() / 360000 }, { user: username }, { date: date }, { seriesname: id.replaceAll('-', ' ') });
        const logRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "logSeason", postId) : null;
        await setDoc(logRefMurlocMrrrglUpdate, {
            review: murlocSeason,
        });
    }

    async function addReviewSeason(reviewText, starrating, murloc, seasonName) {
        setPostId(makeid(9));
        const reviewRefUpdated = doc(db, "Posts", "Reviews", "userPosts", id.replaceAll('-', ' ') + " " + seasonName, "post", postId);
        const reviewRefMurlocMrrrglUpdate = currentUser ? doc(db, "Posts", currentUser.uid, "userPosts", "Logs", "postSeason", postId) : null
        let date = Date().toLocaleLowerCase();
        let datelol = new Date();
        Object.assign(murloc, { review: reviewText }, { star_rating: starrating }, { user: username }, { postId: postId }, { date: date }, { seriesname: id.replaceAll('-', ' ') }, { dateseconds: datelol.getTime() / 360000 });

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
            // index: reviewsUpdate.filter(x => x.user === username).length.toString(), //index === reviews where(username == sebboseb).length + 1
        });

        await setDoc(reviewRefMurlocMrrrglUpdate, {
            review: murloc,
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

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);
    }

    console.log(season[seasonId - minusNumber])

    return (
        <>
            <div className="w-screen flex items-center flex-col">
                <div className="w-screen text-white font-semibold max-w-6xl rounded">
                    <div className="flex mt-16">
                        <div className="flex flex-col">
                            <div>
                                <div className="flex flex-col items-center">
                                    <Link to={{
                                        pathname: `/series/${id}`,
                                    }}>
                                        <img src={`https://image.tmdb.org/t/p/original${season[seasonId - minusNumber]?.poster_path}`} className="min-w-max max-w-min h-56 rounded border-gray-50 border shadow in" alt={succession.name}></img>
                                    </Link>
                                    <div className="flex flex-col items-center w-poster-width p-3 mt-2 shadow">
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
                                                onClick={() => addSeason(season[seasonId - minusNumber], { star_rating: lolmurloc })}
                                            >Log</button> : <button className=" w-32 h-12 bg-soofa-orange rounded shadow hover:bg-yellow-600 dark:text-white font-semibold mt-2"
                                                onClick={() => setInputClicked(true)}
                                            >Log in</button>}
                                            <div onClick={() => setReviewInput(!reviewInput)} className="bg-soofa-orange w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-yellow-600"></div>
                                        </div>
                                    </div>
                                    <h1 className=" text-white border-b mt-3 pb-0.5 border-gray-400 w-40">Ratings</h1>
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
                                            <div onClick={() => addReviewSeason(reviewQuery, lolmurloc, season[seasonId - minusNumber], season[seasonId - minusNumber].name)} className="bg-red-500 w-8 h-12 rounded shadow mt-2 cursor-pointer hover:bg-yellow-600 absolute">
                                                <h1>Review</h1>
                                            </div>
                                        </div> : null}
                                </div>

                            </div>


                        </div>
                        <p>{season[seasonId - minusNumber] && season[seasonId - minusNumber].overview}</p>
                        <div className='flex flex-col text-center px-9 min-w-max'>
                            {minusNumber === 0 ?
                                (season.slice(1, season.length).concat(season.slice(season.length + 1))).map((seasons) => (
                                    <div>
                                        {
                                            <Link to={`/${id}/season-${seasons.season_number}/episodes`}>
                                                {seasons.name === season[seasonId - minusNumber].name ?
                                                    <u>{seasons.name}</u> : <h1>{seasons.name}</h1>}
                                            </Link>
                                        }
                                    </div>
                                ))
                                :
                                (season.map((seasons) => (
                                    <div>
                                        {
                                            <Link to={`/${id}/season-${seasons.season_number}/episodes`}>
                                                {seasons.name === season[seasonId - minusNumber].name ?
                                                    <u>{seasons.name}</u> : <h1>{seasons.name}</h1>}
                                            </Link>
                                        }
                                    </div>
                                )))
                            }
                        </div>
                        {/* {season.map((seasons) => (
                    <Link to="/">
                        {
                            seasons.name
                        }
                    </Link>
                ))} */}
                    </div>
                </div>
                {/* {id} {seasonId} */}
                <div className="w-screen flex justify-center">
                    <div className=" w-screen max-w-6xl grid grid-cols-5 gap-1 mt-3">
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
                </div>
            </div>
        </>
    )
}

export default Episodes;