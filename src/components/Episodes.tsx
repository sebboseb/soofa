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

    const [season, setSeason] = useState([]);
    const [episodes, setEpisodes] = useState([]);

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

    return (
        <>
        <div className="w-screen bg-white">
            <Link to="/">
            {season[seasonId] && season[seasonId].name}
            </Link>
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