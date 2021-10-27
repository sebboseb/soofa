// @ts-nocheck

import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCreditsRequest, getCustomRequest, getEpisodesRequest, getPersonRequest, getSuccessionRequest, getSeasonsRequest, getSearchRequest } from './utils/api';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, addDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from './contexts/AuthContext';
import Tilt from 'react-parallax-tilt';

function DetailsPage() {

    const { id } = useParams();

    const { currentUser } = useAuth();

    const [episodes, setEpisodes] = useState([]);
    const [personsId, setPersonsId] = useState(1991569);
    const [season, setSeason] = useState(6);
    const [person, setPerson] = useState([]);
    const [murloc, setMurloc] = useState("");
    const [castList, setCastList] = useState([]);
    const [starlol, setStarlol] = useState(4.5);
    const seasonsLOL = [];

    const items = [];

    const location = useLocation();
    // const { coldlight, tide, seriesid, seasonNumber, seriesPoster } = location.state; 

    const [succession, setSuccession] = useState([]);

    useEffect(() => {
        async function getSeriesRequest() {
            const seriesList = await getSearchRequest(id.replaceAll('-', ' '));
            // getSuccessionRequest(id); //useparams id
            // id.replace('-', /\s/g)
            setSuccession(seriesList[0]);

            console.log(succession);

            // const seasonList = await getSeasonsRequest(id);
            // setSeason(seasonList);

            // const searchList = await getSearchRequest(id.replaceAll('-', ' '));
            // setSeason(searchList);
            // console.log(season);
        }

        getSeriesRequest();
    }, [])


    for (let i = 1; i <= 20; i++) {
        seasonsLOL.push(
            season[i - 1] &&
            <Tilt tiltEnable={false} glareEnable={true} className=" cursor-pointer" tiltReverse={true} scale={1.05}>
                <li className="bg-black w-44 h-66 rounded mx-1 my-1 text-white">
                    <img src={`https://image.tmdb.org/t/p/original${season[i - 1].poster_path}`} className=" rounded-t"></img>
                    <p className="text-center font-bold">{season[i - 1].name}</p>
                </li>
            </Tilt>
        )
    }


    return (
        <>
        <Link to="/" className="font-semibold text-white text-xl">Dashboard</Link>
        <p className="text-white font-semibold">{id.replaceAll('-', ' ')}</p>
        <p className="text-white">{window.location.pathname}</p>
            <div className=" w-screen flex justify-center">
                <div className=" w-full max-w-6xl h-screen bg-white flex">
                    <div className="flex flex-col items-center">
                        <img src={`https://image.tmdb.org/t/p/original${succession.backdrop_path}`} className=" h-96 w-3/4"></img>
                        <div className="flex">
                            <img src={`https://image.tmdb.org/t/p/original${succession.poster_path}`} className="w-44 h-72"></img>
                            <div className="flex flex-col">
                                <h1>{succession.name}</h1>
                                <p>{succession.overview}</p>
                            </div>
                        </div>
                            <ul className=" list-none flex">
                                {seasonsLOL}
                            </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsPage;
