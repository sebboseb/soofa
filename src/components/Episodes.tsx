// @ts-nocheck

import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCreditsRequest, getCustomRequest, getEpisodesRequest, getPersonRequest, getSuccessionRequest, getSeasonsRequest, getSearchRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Tilt from 'react-parallax-tilt';
import Navbar from './Navbar';

function Episodes() {

    const { id, seasonId } = useParams();

    const { currentUser } = useAuth();

    const [season, setSeason] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [lolmurloc, setLolmurloc] = useState(0);

    useEffect(() => {
        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            const seasonList = await getSeasonsRequest(seriesList[0].id);
            setSeason(seasonList);
            console.log(seasonList);

            const episodeList = await getEpisodesRequest(seriesList[0].id, seasonId);
            console.log(episodeList);
            setEpisodes(episodeList);
        }

        getSeriesRequest();
    }, []);

    function changeRating(newRating, name) {
        setLolmurloc(newRating);
    }

    const userDocumentFavSeason = doc(db, "User", currentUser.uid, "Favourites", "Season");

    async function addSeason(murlocSeason, starrating) {
        Object.assign(murlocSeason, starrating);
        console.log(murlocSeason);

        await setDoc(userDocumentFavSeason, {
            [murlocSeason.name]: murlocSeason
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
                    <StarRatings
                                    rating={lolmurloc}
                                    starRatedColor="#f59e0b"
                                    numberOfStars={5}
                                    starDimension="24px"
                                    starSpacing="1px"
                                    changeRating={changeRating}
                                    name="rating"
                                    starHoverColor="#f59e0b"
                                /></div>
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
                                <li className="bg-black w-52 rounded mx-1 my-1 text-white">
                                    <img className="" src={`https://image.tmdb.org/t/p/original${thingy.still_path}`}></img>
                                </li>
                                <h1 className="text-white font-semibold">{thingy.name}</h1>
                            </div>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default Episodes;