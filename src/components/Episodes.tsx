// @ts-nocheck

import { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useParams } from 'react-router-dom';
import { getEpisodesRequest, getSeasonsRequest, getSearchRequest, getEpisodeRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, query, collection, where } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';

function Episodes() {

    const { id, seasonId } = useParams();

    const { currentUser } = useAuth();

    const [season, setSeason] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [lolmurloc, setLolmurloc] = useState(0);
    // const [isInFavourites, setIsInFavourites] = useState(false);

    useEffect(() => {

        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            const seasonList = await getSeasonsRequest(seriesList[0].id);
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
                    if (doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - 1].name]) {
                        if (doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - 1].name]["star_rating"]) {
                            console.log(doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - 1].name]["star_rating"]);
                            setLolmurloc(doc.data()[id.replaceAll('-', ' ') + " " + seasonList[seasonId - 1].name]["star_rating"]);
                        }
                    }
                }
                else {
                    setIsInFavourites(false);
                    setLolmurloc(0);
                    console.log("lol");
                }
            });
        }

        getSeriesRequest();
    }, [currentUser, id, seasonId]);

    function changeRating(newRating, name) {
        setLolmurloc(newRating);
    }

    const userDocumentFavSeason = currentUser ? doc(db, "User", currentUser.uid, "Favourites", "Season") : null;

    async function addSeason(murlocSeason, starrating) {
        Object.assign(murlocSeason, starrating);
        console.log(murlocSeason);

        await updateDoc(userDocumentFavSeason, {
            [id.replaceAll('-', ' ') + " " + murlocSeason.name]: murlocSeason
        });
    }

    return (
        <>
            <div className="w-screen bg-gray-800 text-white font-semibold">
                <Link to="/">
                    {
                        season[seasonId - 1] && season[seasonId - 1].name}
                </Link>
                <div className="flex">
                    <div className="flex flex-col">
                        <div>
                            <Link to={{
                                pathname: `/series/${id}`,
                            }}>
                                <img className="w-96" src={`https://image.tmdb.org/t/p/original${season[seasonId - 1] && season[seasonId - 1].poster_path}`} alt="" />
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
                        <button className=" w-32 h-12 bg bg-green-500 rounded shadow hover:bg-green-600 text-white font-semibold mt-2"
                            onClick={() => addSeason(season[seasonId - 1], { star_rating: lolmurloc })}
                        >Logga</button>
                    </div>
                    <p>{season[seasonId - 1] && season[seasonId - 1].overview}</p>
                </div>
            </div>
            {/* <Link to="/" className="font-semibold text-white text-xl">Dashboard</Link>
            <p className="text-white font-semibold">{id.replaceAll('-', ' ')}</p>
            <p className="text-white">{window.location.pathname}</p> */}
            <div className=" w-screen flex justify-center">
                {id} {seasonId}
                <ul className="flex flex-wrap">
                    {
                        //onClick upp med meny kolla starrating
                        episodes.filter(Boolean).map((thingy, index) => (

                            <div className="flex flex-col items-center">
                                <Link to={{
                                    pathname: `/${id}/season-${seasonId}/episode/${thingy.episode_number}`,
                                }}>
                                    <li className="bg-black w-52 rounded mx-1 my-1 text-white">
                                        <img className="" src={`https://image.tmdb.org/t/p/original${thingy.still_path}`} alt={thingy.name}></img>
                                    </li>
                                    <h1 className="text-white font-semibold">{thingy.name}</h1>
                                </Link>
                            </div>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default Episodes;